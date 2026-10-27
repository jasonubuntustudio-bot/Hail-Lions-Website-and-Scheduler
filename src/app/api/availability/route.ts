import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { windowsForDayOfWeek } from "@/lib/booking";

export const runtime = "nodejs";

function authorized(req: NextRequest) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  return (req.headers.get("x-admin-password") || "") === secret;
}

/** Open slots for customers (next 21 days) */
export async function GET() {
  if (!isAdminConfigured()) {
    // Demo: Mon–Fri 8/11/3, Sat 8/11, skip Sunday
    const demo: { date: string; window: string }[] = [];
    const d = new Date();
    for (let i = 1; i < 21 && demo.length < 30; i++) {
      const day = new Date(d);
      day.setDate(d.getDate() + i);
      const windows = windowsForDayOfWeek(day.getDay());
      if (!windows.length) continue;
      const iso = day.toISOString().slice(0, 10);
      for (const w of windows) {
        demo.push({ date: iso, window: w });
      }
    }
    return NextResponse.json({ ok: true, mode: "demo", slots: demo });
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data: slots, error } = await supabase
    .from("availability_slots")
    .select("slot_date, time_window, max_jobs")
    .eq("is_open", true)
    .gte("slot_date", today)
    .order("slot_date", { ascending: true })
    .limit(60);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Filter out full slots
  const open: { date: string; window: string }[] = [];
  for (const s of slots || []) {
    const { count } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("scheduled_date", s.slot_date)
      .eq("scheduled_window", s.time_window)
      .eq("status", "scheduled");
    if ((count ?? 0) < (s.max_jobs ?? 1)) {
      open.push({ date: s.slot_date, window: s.time_window });
    }
  }

  return NextResponse.json({ ok: true, slots: open });
}

/** Admin: list all / create slots */
export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const body = await req.json();
  const supabase = createAdminClient();

  // { action: 'list' } or { date, window, isOpen?, maxJobs? }
  if (body.action === "list") {
    const { data, error } = await supabase
      .from("availability_slots")
      .select("*")
      .order("slot_date", { ascending: true })
      .limit(100);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, slots: data });
  }

  const date = String(body.date || "");
  const window = String(body.window || "");
  if (!date || !window) {
    return NextResponse.json(
      { ok: false, error: "date and window required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("availability_slots").upsert(
    {
      slot_date: date,
      time_window: window,
      is_open: body.isOpen !== false,
      max_jobs: body.maxJobs ?? 1,
    },
    { onConflict: "slot_date,time_window" }
  );

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("availability_slots").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
