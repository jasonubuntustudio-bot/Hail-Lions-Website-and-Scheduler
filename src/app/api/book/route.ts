import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { makeConfirmationCode } from "@/lib/booking";
import { notifyAdmin, notifyCustomer } from "@/lib/notify";
import { upsertCustomerFromLead } from "@/lib/crm-server";

export const runtime = "nodejs";

const MAX_PHOTOS = 8;
/** Keep under Vercel Hobby ~4.5MB total request body — compress on client too */
const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

type Parsed = {
  fullName: string;
  phone: string;
  email: string;
  serviceType: string;
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
          {
            ok: false,
            error:
              "Each photo must be under 3 MB after compression. Use fewer photos or smaller images.",
          },
          { status: 400 }
        );
      }
    }

    const code = makeConfirmationCode();

    if (!isAdminConfigured()) {
      console.warn("[book] demo mode quote request", {
        code,
        name: data.fullName,
        phone: data.phone,
        photos: files.length,
      });
      return NextResponse.json({
        ok: true,
        mode: "demo",
        confirmationCode: code,
        message:
          "Quote request received (demo mode). Connect Supabase to save permanently.",
      });
    }

    const supabase = createAdminClient();

    const { data: row, error } = await supabase
      .from("bookings")
      .insert({
        confirmation_code: code,
        status: "quote_requested",
        full_name: data.fullName.trim(),
        phone: data.phone.trim(),
        email: data.email.trim() || null,
        service_type: data.serviceType || null,
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
      })
      .select("id")
      .single();

    if (error || !row) {
      console.error("[book] insert", error);
      return NextResponse.json(
        { ok: false, error: "Could not save request. Please call us." },
        { status: 500 }
      );
    }

    let photosSaved = 0;
    const uploadErrors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      // Normalize HEIC / weird extensions so storage serves predictably
      if (!["jpg", "jpeg", "png", "webp", "gif", "heic", "heif"].includes(ext)) {
        ext = "jpg";
      }
      if (ext === "jpeg") ext = "jpg";
      const path = `${row.id}/${i}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const contentType =
        file.type ||
        (ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : ext === "heic" || ext === "heif"
              ? "image/heic"
              : "image/jpeg");

      const { error: upErr } = await supabase.storage
        .from("booking-photos")
        .upload(path, buffer, {
          contentType,
          upsert: true,
        });
      if (upErr) {
        console.error("[book] photo upload", upErr);
        uploadErrors.push(upErr.message || "upload failed");
        continue;
      }
      const { error: rowErr } = await supabase.from("booking_photos").insert({
        booking_id: row.id,
        storage_path: path,
      });
      if (rowErr) {
        console.error("[book] photo row", rowErr);
        uploadErrors.push(rowErr.message);
        continue;
      }
      photosSaved += 1;
    }

    // Keep photo_count accurate to what actually stored
    if (photosSaved !== files.length) {
      await supabase
        .from("bookings")
        .update({ photo_count: photosSaved })
        .eq("id", row.id);
    }

    try {
      await upsertCustomerFromLead({
        fullName: data.fullName.trim(),
        phone: data.phone.trim(),
        email: data.email.trim() || null,
        address: data.location.address || null,
        city: data.location.city || null,
        zip: data.location.zip || null,
        bookingId: row.id,
        interaction: {
          channel: "quote",
          direction: "inbound",
          subject: "Quote request submitted",
          body: `Website quote request. Service: ${data.serviceType || "n/a"}. Photos saved: ${photosSaved}/${files.length}.`,
        },
      });
    } catch (e) {
      console.error("[book] crm upsert", e);
    }

    await notifyAdmin({
      event: "quote_requested",
      confirmationCode: code,
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      photoCount: photosSaved,
      message: `New quote request ${code} from ${data.fullName.trim()} (${photosSaved} photos saved).`,
    });
    await notifyCustomer({
      toPhone: data.phone.trim(),
      toEmail: data.email.trim() || null,
      confirmationCode: code,
      event: "quote_requested",
      message: `Hail Lions received your request. Code ${code}. We'll send a quote soon.`,
    });

    return NextResponse.json({
      ok: true,
      id: row.id,
      confirmationCode: code,
      photosSaved,
      photosRequested: files.length,
      photoWarning:
        files.length > 0 && photosSaved === 0
          ? "Request saved but photos failed to upload. Please call us or try smaller JPG photos."
          : photosSaved < files.length
            ? `Only ${photosSaved} of ${files.length} photos saved. You can call us to send the rest.`
            : undefined,
      uploadErrors: uploadErrors.length ? uploadErrors.slice(0, 3) : undefined,
    });
  } catch (e) {
    console.error("[book] unexpected", e);
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
