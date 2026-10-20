import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { makeConfirmationCode } from "@/lib/booking";

export const runtime = "nodejs";

const MAX_PHOTOS = 8;
const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // 4MB each

type Parsed = {
  fullName: string;
  phone: string;
  email: string;
  serviceType: string;
  preferredDate: string;
  preferredWindow: string;
  vehicle: {
    year: string;
    make: string;
    model: string;
    color: string;
    vin: string;
  };
  location: { address: string; city: string; zip: string };
  isInsurance: boolean;
  claim: {
    claimNumber: string;
    adjusterName: string;
    adjusterPhone: string;
  };
  notes: string;
  files: File[];
};

async function parseBody(req: NextRequest): Promise<Parsed> {
  const ctype = req.headers.get("content-type") || "";
  if (ctype.includes("multipart/form-data")) {
    const form = await req.formData();
    const files = form
      .getAll("photos")
      .filter((f): f is File => f instanceof File && f.size > 0);
    return {
      fullName: String(form.get("fullName") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      serviceType: String(form.get("serviceType") || ""),
      preferredDate: String(form.get("preferredDate") || ""),
      preferredWindow: String(form.get("preferredWindow") || ""),
      vehicle: {
        year: String(form.get("vehicleYear") || ""),
        make: String(form.get("vehicleMake") || ""),
        model: String(form.get("vehicleModel") || ""),
        color: String(form.get("vehicleColor") || ""),
        vin: String(form.get("vehicleVin") || ""),
      },
      location: {
        address: String(form.get("address") || ""),
        city: String(form.get("city") || ""),
        zip: String(form.get("zip") || ""),
      },
      isInsurance: form.get("isInsurance") === "true",
      claim: {
        claimNumber: String(form.get("claimNumber") || ""),
        adjusterName: String(form.get("adjusterName") || ""),
        adjusterPhone: String(form.get("adjusterPhone") || ""),
      },
      notes: String(form.get("notes") || ""),
      files,
    };
  }

  const body = await req.json();
  return {
    fullName: body.fullName || "",
    phone: body.phone || "",
    email: body.email || "",
    serviceType: body.serviceType || "",
    preferredDate: body.preferredDate || "",
    preferredWindow: body.preferredWindow || "",
    vehicle: body.vehicle || {
      year: "",
      make: "",
      model: "",
      color: "",
      vin: "",
    },
    location: body.location || { address: "", city: "", zip: "" },
    isInsurance: Boolean(body.isInsurance),
    claim: body.claim || {
      claimNumber: "",
      adjusterName: "",
      adjusterPhone: "",
    },
    notes: body.notes || "",
    files: [],
  };
}

export async function POST(req: NextRequest) {
  try {
    const data = await parseBody(req);

    if (!data.fullName.trim() || !data.phone.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name and phone are required." },
        { status: 400 }
      );
    }

    const files = data.files.slice(0, MAX_PHOTOS);
    for (const f of files) {
      if (f.size > MAX_PHOTO_BYTES) {
        return NextResponse.json(
          { ok: false, error: "Each photo must be under 4 MB." },
          { status: 400 }
        );
      }
    }

    const code = makeConfirmationCode();

    if (!isAdminConfigured()) {
      console.warn("[book] demo mode", {
        code,
        name: data.fullName,
        phone: data.phone,
        photos: files.length,
        service: data.serviceType,
        date: data.preferredDate,
      });
      return NextResponse.json({
        ok: true,
        mode: "demo",
        confirmationCode: code,
        message:
          "Request received (demo mode). Connect Supabase to save permanently.",
      });
    }

    const supabase = createAdminClient();

    const { data: row, error } = await supabase
      .from("bookings")
      .insert({
        confirmation_code: code,
        full_name: data.fullName.trim(),
        phone: data.phone.trim(),
        email: data.email.trim() || null,
        service_type: data.serviceType || null,
        preferred_date: data.preferredDate || null,
        preferred_window: data.preferredWindow || null,
        vehicle_year: data.vehicle.year || null,
        vehicle_make: data.vehicle.make || null,
        vehicle_model: data.vehicle.model || null,
        vehicle_color: data.vehicle.color || null,
        vehicle_vin: data.vehicle.vin || null,
        address: data.location.address || null,
        city: data.location.city || null,
        zip: data.location.zip || null,
        is_insurance: data.isInsurance,
        claim_number: data.claim.claimNumber || null,
        adjuster_name: data.claim.adjusterName || null,
        adjuster_phone: data.claim.adjusterPhone || null,
        notes: data.notes || null,
        photo_count: files.length,
        status: "new",
      })
      .select("id")
      .single();

    if (error || !row) {
      console.error("[book] insert", error);
      return NextResponse.json(
        { ok: false, error: "Could not save booking. Please call us." },
        { status: 500 }
      );
    }

    // Upload photos to storage bucket "booking-photos"
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${row.id}/${i}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const { error: upErr } = await supabase.storage
        .from("booking-photos")
        .upload(path, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });
      if (upErr) {
        console.error("[book] photo upload", upErr);
        continue;
      }
      await supabase.from("booking_photos").insert({
        booking_id: row.id,
        storage_path: path,
      });
    }

    return NextResponse.json({
      ok: true,
      id: row.id,
      confirmationCode: code,
    });
  } catch (e) {
    console.error("[book] unexpected", e);
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
