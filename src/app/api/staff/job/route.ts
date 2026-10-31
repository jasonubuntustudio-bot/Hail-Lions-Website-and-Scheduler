import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/staff-auth";

export const runtime = "nodejs";

/** GET ?id=uuid — single job for tech/admin field view */
export async function GET(req: NextRequest) {
  const role = requireStaff(req);
  if (!role) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      job: {
        id,
        confirmation_code: "HL-DEMO",
        status: "scheduled",
        full_name: "Demo Customer",
        phone: "2815550100",
        address: "22400 Westheimer Pkwy",
        city: "Katy",
        zip: "77450",
        vehicle_year: "2020",
        vehicle_make: "Toyota",
        vehicle_model: "Camry",
        scheduled_date: new Date().toISOString().slice(0, 10),
        scheduled_window: "8:00 AM",
        quote_amount_cents: 45000,
        service_type: "hail_damage",
        notes: "Gate code 1234. Park on right.",
        is_insurance: true,
        claim_number: "CLM-001",
        photo_count: 0,
      },
      photos: [],
    });
  }

  const supabase = createAdminClient();
  const { data: job, error } = await supabase
    .from("bookings")
    .select(
      "id, confirmation_code, status, full_name, phone, email, address, city, zip, vehicle_year, vehicle_make, vehicle_model, vehicle_color, vin, scheduled_date, scheduled_window, quote_amount_cents, quote_notes, service_type, notes, is_insurance, claim_number, insurance_company, photo_count, auth_signed_at, created_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  if (!job) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  // Photos via booking_photos + signed URLs
  const { data: photoRows } = await supabase
    .from("booking_photos")
    .select("id, storage_path")
    .eq("booking_id", id);

  const photos: { id: string; url: string }[] = [];
  for (const row of photoRows || []) {
    if (!row.storage_path) continue;
    const { data: signed } = await supabase.storage
      .from("booking-photos")
      .createSignedUrl(row.storage_path, 60 * 30);
    if (signed?.signedUrl) {
      photos.push({ id: row.id, url: signed.signedUrl });
    }
  }

  const mapsQuery = [job.address, job.city, job.zip, "TX"]
    .filter(Boolean)
    .join(", ");

  return NextResponse.json({
    ok: true,
    role,
    job,
    photos,
    maps: {
      query: mapsQuery,
      googleMapsUrl: mapsQuery
        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`
        : null,
      appleMapsUrl: mapsQuery
        ? `https://maps.apple.com/?daddr=${encodeURIComponent(mapsQuery)}`
        : null,
    },
  });
}

/** PATCH — tech can mark in_progress / completed only */
export async function PATCH(req: NextRequest) {
  const role = requireStaff(req);
  if (!role) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  const status = String(body.status || "");

  if (!id || !status) {
    return NextResponse.json(
      { ok: false, error: "id and status required" },
      { status: 400 }
    );
  }

  const allowedTech = ["in_progress", "completed", "scheduled"];
  if (role === "tech" && !allowedTech.includes(status)) {
    return NextResponse.json(
      { ok: false, error: "Techs can only update job progress status." },
      { status: 403 }
    );
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: true, mode: "demo", status });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, status });
}
