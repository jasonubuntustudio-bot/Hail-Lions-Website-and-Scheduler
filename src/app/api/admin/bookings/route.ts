import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { notifyCustomer } from "@/lib/notify";
import { quoteReminderTemplates } from "@/lib/templates";
import { formatMoney } from "@/lib/booking";

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
    .limit(100);

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

  const body = await req.json();
  const { id } = body as { id?: string };
  if (!id) {
    return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.status) updates.status = body.status;

  // Send quote
  if (body.quoteAmountCents != null || body.sendQuote) {
    const cents =
      typeof body.quoteAmountCents === "number"
        ? body.quoteAmountCents
        : Math.round(Number(body.quoteAmountDollars) * 100);
    if (!cents || cents < 0) {
      return NextResponse.json(
        { ok: false, error: "Valid quote amount required" },
        { status: 400 }
      );
    }
    updates.quote_amount_cents = cents;
    updates.quote_notes = body.quoteNotes || null;
    updates.quoted_at = new Date().toISOString();
    updates.status = "quoted";
  }

  const supabase = createAdminClient();
  const { data: before } = await supabase
    .from("bookings")
    .select("phone, email, confirmation_code, full_name")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("bookings").update(updates).eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (updates.status === "quoted" && before?.confirmation_code) {
    const cents = (updates.quote_amount_cents as number) || 0;
    const site =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://hail-lions-website-and-scheduler.vercel.app";
    const quoteUrl = `${site.replace(/\/$/, "")}/quote/${before.confirmation_code}`;
    const tpl = quoteReminderTemplates({
      customerName: before.full_name || "there",
      quoteAmountCents: cents,
      confirmationCode: before.confirmation_code,
      quoteNotes: (updates.quote_notes as string) || null,
      quoteUrl,
      dayNumber: 1,
    });
    await notifyCustomer({
      toPhone: before.phone,
      toEmail: before.email,
      confirmationCode: before.confirmation_code,
      event: "quoted",
      message: tpl.sms,
      smsBody: tpl.sms,
      emailSubject: tpl.emailSubject,
      emailBody: tpl.emailBody,
    });
    // CRM timeline
    const { data: bk } = await supabase
      .from("bookings")
      .select("customer_id")
      .eq("id", id)
      .maybeSingle();
    if (bk?.customer_id) {
      await supabase.from("customer_interactions").insert({
        customer_id: bk.customer_id,
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
        .eq("id", bk.customer_id);
    }
  }

  return NextResponse.json({ ok: true });
}
