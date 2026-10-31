import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/staff-auth";

export const runtime = "nodejs";

/**
 * GET — today's / upcoming scheduled jobs for field techs (and admin).
 * Query: ?from=YYYY-MM-DD&days=14
 */
export async function GET(req: NextRequest) {
  const role = requireStaff(req);
  if (!role) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminConfigured()) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      jobs: [
        {
          id: "demo-1",
          confirmation_code: "HL-DEMO",
          status: "scheduled",
          full_name: "Demo Customer",
          phone: "2815550100",
          address: "123 Main St",
          city: "Katy",
          zip: "77494",
          vehicle_year: "2020",
          vehicle_make: "Toyota",
          vehicle_model: "Camry",
          scheduled_date: new Date().toISOString().slice(0, 10),
          scheduled_window: "8:00 AM",
          quote_amount_cents: 45000,
          service_type: "hail_damage",
          notes: "Demo job — connect Supabase for live data.",
        },
      ],
    });
  }

  const from =
    req.nextUrl.searchParams.get("from") ||
    new Date().toISOString().slice(0, 10);
  const days = Math.min(
    30,
    Math.max(1, Number(req.nextUrl.searchParams.get("days") || 14))
  );
  const end = new Date(from + "T12:00:00");
  end.setDate(end.getDate() + days);
  const to = end.toISOString().slice(0, 10);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, confirmation_code, status, full_name, phone, email, address, city, zip, vehicle_year, vehicle_make, vehicle_model, vehicle_color, scheduled_date, scheduled_window, quote_amount_cents, service_type, notes, is_insurance, claim_number, photo_count"
    )
    .in("status", ["scheduled", "in_progress", "quote_approved"])
    .gte("scheduled_date", from)
    .lte("scheduled_date", to)
    .order("scheduled_date", { ascending: true })
    .order("scheduled_window", { ascending: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Tech does not get customer CRM notes beyond job notes
  const jobs = (data || []).map((row) => ({
    ...row,
    role_view: role,
  }));

  return NextResponse.json({ ok: true, role, from, to, jobs });
}
