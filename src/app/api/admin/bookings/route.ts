import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function authorized(req: NextRequest) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  const header = req.headers.get("x-admin-password") || "";
  return header === secret;
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
  const { id, status } = body as { id?: string; status?: string };
  if (!id || !status) {
    return NextResponse.json({ ok: false, error: "id and status required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
