import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { notifyCustomer } from "@/lib/notify";
import { quoteReminderTemplates } from "@/lib/templates";
import { formatMoney, makeConfirmationCode } from "@/lib/booking";

export const runtime = "nodejs";

function authorized(req: NextRequest) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  return (req.headers.get("x-admin-password") || "") === secret;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminConfigured()) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      bookings: [],
      message: "Supabase not configured.",
    });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, bookings: data });
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: before, error: fetchErr } = await supabase
    .from("bookings")
    .select(
      "id, phone, email, confirmation_code, full_name, status, customer_id, service_type, vehicle_year, vehicle_make, vehicle_model"
    )
    .eq("id", id)
    .maybeSingle();

  if (fetchErr) {
    return NextResponse.json({ ok: false, error: fetchErr.message }, { status: 500 });
  }
  if (!before) {
    return NextResponse.json({ ok: false, error: "Booking not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  const sendingQuote = body.sendQuote === true || body.quoteAmountCents != null;

  if (sendingQuote) {
    let cents: number;
    if (typeof body.quoteAmountCents === "number" && Number.isFinite(body.quoteAmountCents)) {
      cents = Math.round(body.quoteAmountCents);
    } else {
      const raw = String(body.quoteAmountDollars ?? "")
        .replace(/[$,\s]/g, "")
        .trim();
      cents = Math.round(parseFloat(raw) * 100);
    }

    if (!Number.isFinite(cents) || cents <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Enter a valid quote amount greater than $0 (example: 450 or 450.00).",
        },
        { status: 400 }
      );
    }

    updates.quote_amount_cents = cents;
    updates.quote_notes =
      typeof body.quoteNotes === "string" && body.quoteNotes.trim()
        ? body.quoteNotes.trim()
        : null;
    updates.quoted_at = new Date().toISOString();
    updates.status = "quoted";

    // Always ensure a confirmation code so the customer link works
    if (!before.confirmation_code) {
      updates.confirmation_code = makeConfirmationCode();
    }
  }

  if (typeof body.status === "string" && body.status && !sendingQuote) {
    updates.status = body.status;
  }

  const { data: after, error: upErr } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select(
      "id, status, confirmation_code, quote_amount_cents, quote_notes, quoted_at, full_name, phone, email, service_type"
    )
    .maybeSingle();

  if (upErr) {
    console.error("[admin/bookings] update failed", upErr);
    return NextResponse.json(
      {
        ok: false,
        error:
          upErr.message.includes("quoted_at") || upErr.message.includes("column")
            ? `Database column missing: ${upErr.message}. Run supabase/schema.sql auth/quote columns in Supabase.`
            : upErr.message,
      },
      { status: 500 }
    );
  }

  const notify: { sms?: boolean; email?: boolean; skipped?: string } = {};

  if (sendingQuote && after?.confirmation_code) {
    const cents = (after.quote_amount_cents as number) || 0;
    const site =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://hail-lions-website-and-scheduler.vercel.app";
    const quoteUrl = `${site.replace(/\/$/, "")}/quote/${after.confirmation_code}`;
    const vehicleSummary = [
      before.vehicle_year,
      before.vehicle_make,
      before.vehicle_model,
    ]
      .filter(Boolean)
      .join(" ");

    const tpl = quoteReminderTemplates({
      customerName: after.full_name || before.full_name || "there",
      quoteAmountCents: cents,
      confirmationCode: after.confirmation_code,
      serviceType: after.service_type || before.service_type,
      quoteNotes: (after.quote_notes as string) || null,
      quoteUrl,
      dayNumber: 1,
      vehicleSummary: vehicleSummary || null,
    });

    try {
      const result = await notifyCustomer({
        toPhone: after.phone || before.phone,
        toEmail: after.email || before.email,
        confirmationCode: after.confirmation_code,
        event: "quoted",
        message: tpl.sms,
        smsBody: tpl.sms,
        emailSubject: tpl.emailSubject,
        emailBody: tpl.emailBody,
      });
      // notify may return void — treat as attempted
      notify.sms = true;
      notify.email = true;
      void result;
    } catch (e) {
      console.error("[admin/bookings] notify failed", e);
      notify.skipped = "Notification failed (quote still saved). Check Twilio/Resend env.";
    }

    // CRM timeline — never fail the quote on this
    try {
      const customerId = before.customer_id;
      if (customerId) {
        await supabase.from("customer_interactions").insert({
          customer_id: customerId,
          booking_id: id,
          channel: "quote",
          direction: "outbound",
          subject: "Quote sent",
          body: `Quoted ${formatMoney(cents)}. ${body.quoteNotes || ""}`.trim(),
          created_by: "admin",
        });
        await supabase
          .from("customers")
          .update({
            last_contact_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", customerId);
      }
    } catch (e) {
      console.error("[admin/bookings] CRM log failed", e);
    }

    return NextResponse.json({
      ok: true,
      booking: after,
      quoteUrl,
      notify,
      message: notify.skipped
        ? `Quote saved. ${notify.skipped}`
        : "Quote saved and customer notified (SMS/email if configured).",
    });
  }

  return NextResponse.json({ ok: true, booking: after });
}
