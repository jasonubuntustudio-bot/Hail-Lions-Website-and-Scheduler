import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/** POST { password } → { role: 'admin' | 'tech' } */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = String(body.password || "");
  const admin = process.env.ADMIN_PASSWORD || "";
  const tech = process.env.TECH_PASSWORD || "";

  if (admin && password === admin) {
    return NextResponse.json({
      ok: true,
      role: "admin",
      business: "Hail Lions",
    });
  }
  if (tech && password === tech) {
    return NextResponse.json({
      ok: true,
      role: "tech",
      business: "Hail Lions",
    });
  }
  return NextResponse.json(
    { ok: false, error: "Invalid password" },
    { status: 401 }
  );
}
