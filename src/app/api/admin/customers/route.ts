import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/crm";

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
    return NextResponse.json({ ok: true, mode: "demo", customers: [] });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  const id = req.nextUrl.searchParams.get("id");
  const supabase = createAdminClient();

  if (id) {
    const { data: customer, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !customer) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    const { data: interactions } = await supabase
      .from("customer_interactions")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", { ascending: false })
      .limit(50);
    const { data: bookings } = await supabase
      .from("bookings")
      .select(
        "id, confirmation_code, status, created_at, service_type, quote_amount_cents, scheduled_date, photo_count"
      )
      .eq("customer_id", id)
      .order("created_at", { ascending: false })
      .limit(20);
    return NextResponse.json({
      ok: true,
      customer,
      interactions: interactions || [],
      bookings: bookings || [],
    });
  }

  let query = supabase
    .from("customers")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(100);

  if (q) {
    const digits = normalizePhone(q);
    query = query.or(
      `full_name.ilike.%${q}%,phone.ilike.%${digits || q}%,email.ilike.%${q}%,city.ilike.%${q}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, customers: data || [] });
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const body = await req.json();
  const id = body.id as string;
  if (!id) {
    return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  for (const key of [
    "full_name",
    "email",
    "notes",
    "address",
    "city",
    "zip",
    "preferred_contact",
    "next_follow_up_at",
  ]) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (body.tags) updates.tags = body.tags;
  if (body.phone) updates.phone = normalizePhone(body.phone) || body.phone;

  const supabase = createAdminClient();
  const { error } = await supabase.from("customers").update(updates).eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const body = await req.json();
  const supabase = createAdminClient();

  // Log interaction
  if (body.action === "interaction") {
    const { customerId, channel, direction, subject, body: text } = body;
    if (!customerId || !channel) {
      return NextResponse.json(
        { ok: false, error: "customerId and channel required" },
        { status: 400 }
      );
    }
    const { error } = await supabase.from("customer_interactions").insert({
      customer_id: customerId,
      channel,
      direction: direction || "outbound",
      subject: subject || null,
      body: text || null,
      created_by: "admin",
    });
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    await supabase
      .from("customers")
      .update({
        last_contact_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", customerId);
    return NextResponse.json({ ok: true });
  }

  // Create customer manually
  const phone = normalizePhone(body.phone || "") || body.phone;
  if (!body.fullName || !phone) {
    return NextResponse.json(
      { ok: false, error: "Name and phone required" },
      { status: 400 }
    );
  }
  const { data, error } = await supabase
    .from("customers")
    .insert({
      full_name: body.fullName,
      phone,
      email: body.email || null,
      city: body.city || null,
      notes: body.notes || null,
      source: "manual",
    })
    .select("id")
    .single();
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: data.id });
}
