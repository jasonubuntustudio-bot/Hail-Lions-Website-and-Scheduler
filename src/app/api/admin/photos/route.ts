import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function authorized(req: NextRequest) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  return (req.headers.get("x-admin-password") || "") === secret;
}

/** GET ?bookingId= — private signed photo URLs for admin only */
export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const bookingId = req.nextUrl.searchParams.get("bookingId");
  if (!bookingId) {
    return NextResponse.json({ ok: false, error: "bookingId required" }, { status: 400 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: true, mode: "demo", photos: [] });
  }

  const supabase = createAdminClient();
  const { data: rows, error } = await supabase
    .from("booking_photos")
    .select("id, storage_path")
    .eq("booking_id", bookingId);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const photos: { id: string; url: string }[] = [];
  for (const row of rows || []) {
    const { data: signed, error: sErr } = await supabase.storage
      .from("booking-photos")
      .createSignedUrl(row.storage_path, 60 * 30); // 30 min
    if (!sErr && signed?.signedUrl) {
      photos.push({ id: row.id, url: signed.signedUrl });
    }
  }

  return NextResponse.json({ ok: true, photos });
}
