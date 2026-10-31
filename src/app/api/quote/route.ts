import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { notifyCustomer, notifyAdmin } from "@/lib/notify";
import { appointmentConfirmationTemplates } from "@/lib/templates";

export const runtime = "nodejs";

function publicBooking(row: Record<string, unknown>) {
  return {
    confirmationCode: row.confirmation_code,
    status: row.status,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email ?? null,
    address: row.address ?? null,
    serviceType: row.service_type,
    vehicleYear: row.vehicle_year,
    vehicleMake: row.vehicle_make,
    vehicleModel: row.vehicle_model,
    vehicleColor: row.vehicle_color ?? null,
    vin: row.vin ?? null,
    quoteAmountCents: row.quote_amount_cents,
    quoteNotes: row.quote_notes,
    scheduledDate: row.scheduled_date,
    scheduledWindow: row.scheduled_window,
    isInsurance: !!row.is_insurance,
    claimNumber: row.claim_number ?? null,
    insuranceCompany: row.insurance_company ?? null,
    authSignedAt: row.auth_signed_at ?? null,
  };
}

/** GET ?code=HL-XXXX — customer quote status */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ ok: false, error: "Missing code" }, { status: 400 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      booking: {
        confirmationCode: code,
        status: "quoted",
        fullName: "Demo Customer",
        phone: "",
        serviceType: "hail_damage",
        vehicleYear: "2020",
        vehicleMake: "Toyota",
        vehicleModel: "Camry",
        quoteAmountCents: 45000,
        quoteNotes: "Demo quote — connect Supabase for real data.",
        scheduledDate: null,
        scheduledWindow: null,
      },
    });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "confirmation_code, status, full_name, phone, email, address, service_type, vehicle_year, vehicle_make, vehicle_model, vehicle_color, vin, quote_amount_cents, quote_notes, scheduled_date, scheduled_window, is_insurance, claim_number, insurance_company, auth_signed_at"
    )
    .eq("confirmation_code", code)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { ok: false, error: "Quote not found. Check your confirmation code." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, booking: publicBooking(data) });
}

/**
 * POST body:
 * { code, action: 'approve' | 'decline' | 'schedule', date?, window? }
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const code = String(body.code || "").trim().toUpperCase();
  const action = String(body.action || "");

  if (!code || !action) {
    return NextResponse.json(
      { ok: false, error: "code and action required" },
      { status: 400 }
    );
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      status:
        action === "approve"
          ? "quote_approved"
          : action === "decline"
            ? "declined"
            : "scheduled",
      confirmationCode: code,
    });
  }

  const supabase = createAdminClient();
  const { data: row, error } = await supabase
    .from("bookings")
    .select("id, status")
    .eq("confirmation_code", code)
    .maybeSingle();

  if (error || !row) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  if (action === "approve") {
    if (row.status !== "quoted") {
      return NextResponse.json(
        { ok: false, error: "This quote is not waiting for approval." },
        { status: 400 }
      );
    }
    const { error: up } = await supabase
      .from("bookings")
      .update({
        status: "quote_approved",
        quote_approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    if (up) {
      return NextResponse.json({ ok: false, error: up.message }, { status: 500 });
    }
    const { data: rowFull } = await supabase
      .from("bookings")
      .select("phone, email, confirmation_code, full_name")
      .eq("id", row.id)
      .maybeSingle();
    if (rowFull?.confirmation_code) {
      await notifyAdmin({
        event: "quote_approved",
        confirmationCode: rowFull.confirmation_code,
        fullName: rowFull.full_name,
        phone: rowFull.phone,
        photoCount: 0,
        message: `${rowFull.full_name} accepted quote ${rowFull.confirmation_code}.`,
      });
      await notifyCustomer({
        toPhone: rowFull.phone,
        toEmail: rowFull.email,
        confirmationCode: rowFull.confirmation_code,
        event: "quote_approved",
        message: `You accepted the Hail Lions quote. Pick an available day and time in your link.`,
      });
    }
    return NextResponse.json({ ok: true, status: "quote_approved" });
  }

  if (action === "decline") {
    if (!["quoted", "quote_approved"].includes(row.status)) {
      return NextResponse.json(
        { ok: false, error: "Cannot decline at this stage." },
        { status: 400 }
      );
    }
    const { error: up } = await supabase
      .from("bookings")
      .update({
        status: "declined",
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    if (up) {
      return NextResponse.json({ ok: false, error: up.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, status: "declined" });
  }

  if (action === "schedule") {
    const date = String(body.date || "");
    const window = String(body.window || "");
    if (!date || !window) {
      return NextResponse.json(
        { ok: false, error: "date and window required" },
        { status: 400 }
      );
    }
    if (!["quote_approved", "quoted"].includes(row.status)) {
      // allow quoted if they approved in same session before refresh
      if (row.status !== "quote_approved") {
        return NextResponse.json(
          { ok: false, error: "Approve the quote before scheduling." },
          { status: 400 }
        );
      }
    }

    // Verify slot is open
    const { data: slot } = await supabase
      .from("availability_slots")
      .select("id, is_open, max_jobs")
      .eq("slot_date", date)
      .eq("time_window", window)
      .eq("is_open", true)
      .maybeSingle();

    if (!slot) {
      return NextResponse.json(
        { ok: false, error: "That time is no longer available. Pick another." },
        { status: 400 }
      );
    }

    const { count } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("scheduled_date", date)
      .eq("scheduled_window", window)
      .eq("status", "scheduled");

    if ((count ?? 0) >= (slot.max_jobs ?? 1)) {
      return NextResponse.json(
        { ok: false, error: "That slot is full. Pick another." },
        { status: 400 }
      );
    }

    const { error: up } = await supabase
      .from("bookings")
      .update({
        status: "scheduled",
        scheduled_date: date,
        scheduled_window: window,
        scheduled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (up) {
      return NextResponse.json({ ok: false, error: up.message }, { status: 500 });
    }

    const { data: sched } = await supabase
      .from("bookings")
      .select(
        "phone, email, confirmation_code, full_name, address, city, zip, service_type, quote_amount_cents"
      )
      .eq("id", row.id)
      .maybeSingle();
    if (sched?.confirmation_code) {
      await notifyAdmin({
        event: "scheduled",
        confirmationCode: sched.confirmation_code,
        fullName: sched.full_name,
        phone: sched.phone,
        photoCount: 0,
        message: `${sched.full_name} scheduled ${date} ${window} (${sched.confirmation_code}).`,
      });
      const tpl = appointmentConfirmationTemplates({
        customerName: sched.full_name || "there",
        confirmationCode: sched.confirmation_code,
        scheduledDate: date,
        scheduledWindow: window,
        address: sched.address,
        city: sched.city,
        zip: sched.zip,
        serviceType: sched.service_type,
        quoteAmountCents: sched.quote_amount_cents,
      });
      await notifyCustomer({
        toPhone: sched.phone,
        toEmail: sched.email,
        confirmationCode: sched.confirmation_code,
        event: "scheduled",
        message: tpl.sms,
        smsBody: tpl.sms,
        emailSubject: tpl.emailSubject,
        emailBody: tpl.emailBody,
      });
    }
    return NextResponse.json({
      ok: true,
      status: "scheduled",
      scheduledDate: date,
      scheduledWindow: window,
    });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
