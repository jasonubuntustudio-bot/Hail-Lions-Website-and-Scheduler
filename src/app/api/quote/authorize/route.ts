import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { notifyAdmin, notifyCustomer } from "@/lib/notify";
import {
  buildAuthorizationHtml,
  type AuthFill,
} from "@/lib/authorization";

export const runtime = "nodejs";

/**
 * POST — customer e-signs repair authorization then accepts quote.
 * Body: { code, signerName, signatureDataUrl?, agreed: true }
 * Stores HTML in booking-photos bucket; sets booking to quote_approved.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const code = String(body.code || "").trim().toUpperCase();
  const signerName = String(body.signerName || "").trim();
  const signatureDataUrl =
    typeof body.signatureDataUrl === "string" ? body.signatureDataUrl : null;
  const agreed = body.agreed === true;

  if (!code || !signerName || !agreed) {
    return NextResponse.json(
      {
        ok: false,
        error: "Confirmation code, typed full name, and agreement are required.",
      },
      { status: 400 }
    );
  }

  if (signerName.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Enter your full legal name as signature." },
      { status: 400 }
    );
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      status: "quote_approved",
      confirmationCode: code,
      message: "Demo: authorization recorded (no storage).",
    });
  }

  const supabase = createAdminClient();
  const { data: row, error } = await supabase
    .from("bookings")
    .select(
      "id, status, confirmation_code, full_name, phone, email, address, service_type, vehicle_year, vehicle_make, vehicle_model, vehicle_color, vin, quote_amount_cents, quote_notes, is_insurance, claim_number, insurance_company"
    )
    .eq("confirmation_code", code)
    .maybeSingle();

  if (error || !row) {
    return NextResponse.json({ ok: false, error: "Quote not found" }, { status: 404 });
  }

  if (row.status !== "quoted") {
    return NextResponse.json(
      {
        ok: false,
        error:
          row.status === "quote_approved" || row.status === "scheduled"
            ? "This quote was already accepted."
            : "This quote is not waiting for approval.",
      },
      { status: 400 }
    );
  }

  const signedAt = new Date().toISOString();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;

  const fill: AuthFill = {
    confirmationCode: row.confirmation_code,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    vehicleYear: row.vehicle_year,
    vehicleMake: row.vehicle_make,
    vehicleModel: row.vehicle_model,
    vehicleColor: row.vehicle_color,
    vin: row.vin,
    serviceType: row.service_type,
    quoteAmountCents: row.quote_amount_cents,
    quoteNotes: row.quote_notes,
    isInsurance: !!row.is_insurance,
    claimNumber: row.claim_number,
    insuranceCompany: row.insurance_company,
  };

  const html = buildAuthorizationHtml(fill, {
    signerName,
    signedAtIso: signedAt,
    signatureDataUrl,
    ip,
  });

  const path = `${row.confirmation_code}/authorization-${Date.now()}.html`;
  const { error: upErr } = await supabase.storage
    .from("booking-photos")
    .upload(path, new Blob([html], { type: "text/html;charset=utf-8" }), {
      contentType: "text/html;charset=utf-8",
      upsert: false,
    });

  if (upErr) {
    console.error("auth upload", upErr);
    return NextResponse.json(
      {
        ok: false,
        error: "Could not store signed authorization. Try again or call us.",
        detail: upErr.message,
      },
      { status: 500 }
    );
  }

  const { error: upd } = await supabase
    .from("bookings")
    .update({
      status: "quote_approved",
      quote_approved_at: signedAt,
      auth_signed_at: signedAt,
      auth_signer_name: signerName,
      auth_storage_path: path,
      updated_at: signedAt,
    })
    .eq("id", row.id);

  if (upd) {
    // Column may not exist yet — try minimal update
    if (/auth_|column/i.test(upd.message)) {
      const { error: upd2 } = await supabase
        .from("bookings")
        .update({
          status: "quote_approved",
          quote_approved_at: signedAt,
          updated_at: signedAt,
        })
        .eq("id", row.id);
      if (upd2) {
        return NextResponse.json(
          { ok: false, error: upd2.message },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ ok: false, error: upd.message }, { status: 500 });
    }
  }

  await notifyAdmin({
    event: "quote_approved",
    confirmationCode: row.confirmation_code,
    fullName: row.full_name,
    phone: row.phone,
    photoCount: 0,
    message: `${row.full_name} signed authorization & accepted quote ${row.confirmation_code}.`,
  });
  await notifyCustomer({
    toPhone: row.phone,
    toEmail: row.email,
    confirmationCode: row.confirmation_code,
    event: "quote_approved",
    message: `You signed the repair authorization and accepted the Hail Lions quote. Pick a day and time in your link.`,
  });

  return NextResponse.json({
    ok: true,
    status: "quote_approved",
    confirmationCode: row.confirmation_code,
    authPath: path,
  });
}
