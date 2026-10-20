import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Body = {
  fullName?: string;
  phone?: string;
  email?: string;
  serviceType?: string;
  preferredDate?: string;
  preferredWindow?: string;
  vehicle?: {
    year?: string;
    make?: string;
    model?: string;
    color?: string;
    vin?: string;
  };
  location?: {
    address?: string;
    city?: string;
    zip?: string;
  };
  isInsurance?: boolean;
  claim?: {
    claimNumber?: string;
    adjusterName?: string;
    adjusterPhone?: string;
  };
  photoCount?: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    if (!body.fullName?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name and phone are required." },
        { status: 400 }
      );
    }

    // Without Supabase configured, accept the request so the UI still works in demo mode
    if (!isAdminConfigured()) {
      console.warn(
        "[book] Supabase not configured — booking logged only:",
        body.fullName,
        body.phone
      );
      return NextResponse.json({
        ok: true,
        mode: "demo",
        message:
          "Request received (demo mode — add Supabase env vars to save bookings).",
      });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        full_name: body.fullName.trim(),
        phone: body.phone.trim(),
        email: body.email?.trim() || null,
        service_type: body.serviceType || null,
        preferred_date: body.preferredDate || null,
        preferred_window: body.preferredWindow || null,
        vehicle_year: body.vehicle?.year || null,
        vehicle_make: body.vehicle?.make || null,
        vehicle_model: body.vehicle?.model || null,
        vehicle_color: body.vehicle?.color || null,
        vehicle_vin: body.vehicle?.vin || null,
        address: body.location?.address || null,
        city: body.location?.city || null,
        zip: body.location?.zip || null,
        is_insurance: Boolean(body.isInsurance),
        claim_number: body.claim?.claimNumber || null,
        adjuster_name: body.claim?.adjusterName || null,
        adjuster_phone: body.claim?.adjusterPhone || null,
        photo_count: body.photoCount ?? 0,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[book] insert error", error);
      return NextResponse.json(
        { ok: false, error: "Could not save booking. Try calling us." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    console.error("[book] unexpected", e);
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
