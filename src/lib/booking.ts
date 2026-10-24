export const SERVICE_TYPES = [
  { id: "hail_damage", label: "Hail Damage" },
  { id: "door_ding", label: "Door Ding / Dent" },
  { id: "crease", label: "Crease / Larger Dent" },
  { id: "classic_car", label: "Classic Car PDR" },
  { id: "other_pdr", label: "Other Paintless Repair" },
] as const;

export const TIME_WINDOWS = [
  "Morning (8 AM – 12 PM)",
  "Afternoon (12 PM – 4 PM)",
  "Late Afternoon (4 PM – 7 PM)",
] as const;

export const BOOKING_STATUSES = [
  "quote_requested",
  "quoted",
  "quote_approved",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
  "declined",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export function makeConfirmationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "HL-";
  for (let i = 0; i < 4; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

export function serviceLabel(id: string) {
  return SERVICE_TYPES.find((s) => s.id === id)?.label ?? (id || "—");
}

export function statusLabel(status: string) {
  const map: Record<string, string> = {
    quote_requested: "Pending quote",
    quoted: "Quote sent",
    quote_approved: "Quote accepted",
    scheduled: "Scheduled",
    in_progress: "In progress",
    completed: "Completed",
    cancelled: "Cancelled",
    declined: "Declined",
    new: "Pending quote",
    contacted: "Contacted",
  };
  return map[status] ?? status;
}

export function formatMoney(cents: number | null | undefined) {
  if (cents == null || Number.isNaN(cents)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/** Admin board columns */
export const ADMIN_SECTIONS = [
  {
    id: "pending",
    title: "Pending",
    description: "Photos received — send a quote",
    statuses: ["quote_requested", "new"],
  },
  {
    id: "quoted",
    title: "Quoted",
    description: "Waiting for customer to accept",
    statuses: ["quoted"],
  },
  {
    id: "accepted",
    title: "Accepted",
    description: "Quote approved — schedule or already booked",
    statuses: ["quote_approved", "scheduled"],
  },
] as const;
