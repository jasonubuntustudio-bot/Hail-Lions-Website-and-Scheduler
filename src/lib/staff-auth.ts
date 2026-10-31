import { NextRequest } from "next/server";

export type StaffRole = "admin" | "tech";

/**
 * Admin: ADMIN_PASSWORD
 * Tech: TECH_PASSWORD (falls back to ADMIN_PASSWORD so owner can use either)
 */
export function staffAuth(req: NextRequest): StaffRole | null {
  const pwd =
    req.headers.get("x-admin-password") ||
    req.headers.get("x-staff-password") ||
    "";
  const admin = process.env.ADMIN_PASSWORD || "";
  const tech = process.env.TECH_PASSWORD || "";

  if (admin && pwd === admin) return "admin";
  if (tech && pwd === tech) return "tech";
  // If only admin password is set, tech login is not available
  return null;
}

export function requireAdmin(req: NextRequest): boolean {
  return staffAuth(req) === "admin";
}

export function requireStaff(req: NextRequest): StaffRole | null {
  return staffAuth(req);
}
