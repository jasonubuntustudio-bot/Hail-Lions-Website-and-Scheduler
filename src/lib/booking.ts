export const SERVICE_TYPES = [
  { id: "hail_damage", label: "Hail Damage" },
  { id: "door_ding", label: "Door Ding / Dent" },
  { id: "crease", label: "Crease / Larger Dent" },
  { id: "classic_car", label: "Classic Car PDR" },
  { id: "other_pdr", label: "Other Paintless Repair" },
] as const;

/** Appointment start times — Mon–Fri: all three; Sat: 8 AM + 11 AM only; Sun: closed */
export const TIME_WINDOWS = ["8:00 AM", "11:00 AM", "3:00 PM"] as const;

export const WEEKDAY_WINDOWS = ["8:00 AM", "11:00 AM", "3:00 PM"] as const;
export const SATURDAY_WINDOWS = ["8:00 AM", "11:00 AM"] as const;

/** Windows allowed for a JS getDay() value (0=Sun … 6=Sat) */
export function windowsForDayOfWeek(day: number): readonly string[] {
  if (day === 0) return []; // Sunday closed
  if (day === 6) return SATURDAY_WINDOWS;
  return WEEKDAY_WINDOWS;
}

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

export function formatMoney(cents: number | null | undefined) {
  if (cents == null || Number.isNaN(cents)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/** Days after a quote is sent with no accept → treat as lost / archive */
export const QUOTE_LOST_AFTER_DAYS = 30;

export type BoardSectionId =
  | "pending"
  | "quoted"
  | "accepted"
  | "scheduled"
  | "repaired"
  | "not_accepted"
  | "archive"
  | "all";

/** Admin board columns */
export const ADMIN_SECTIONS: {
  id: BoardSectionId;
  title: string;
  description: string;
  short: string;
}[] = [
  {
    id: "pending",
    title: "Pending",
    short: "Pending",
    description: "Photos in — needs a quote",
  },
  {
    id: "quoted",
    title: "Quoted",
    short: "Quoted",
    description: "Quote sent — waiting on customer (under 30 days)",
  },
  {
    id: "accepted",
    title: "Accepted",
    short: "Accepted",
    description: "Customer accepted — not scheduled yet",
  },
  {
    id: "scheduled",
    title: "Scheduled",
    short: "Sched.",
    description: "On the calendar or in progress",
  },
  {
    id: "repaired",
    title: "Repaired",
    short: "Done",
    description: "Work completed",
  },
  {
    id: "not_accepted",
    title: "Not accepted",
    short: "No",
    description: "Declined or cancelled by customer/shop",
  },
  {
    id: "archive",
    title: "Archive / lost",
    short: "Lost",
    description: "Quoted 30+ days with no accept (or archived)",
  },
  {
    id: "all",
    title: "All jobs",
    short: "All",
    description: "Every job (use filters to narrow)",
  },
];

type BoardBooking = {
  status: string;
  quoted_at?: string | null;
  created_at?: string | null;
  quote_approved_at?: string | null;
};

function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return (Date.now() - t) / (1000 * 60 * 60 * 24);
}

/** True when quoted and still waiting, but quote is older than 30 days */
export function isQuoteLost(b: BoardBooking): boolean {
  if (b.status !== "quoted") return false;
  const d = daysSince(b.quoted_at || b.created_at);
  return d != null && d >= QUOTE_LOST_AFTER_DAYS;
}

/** Which board tab a booking belongs on */
export function boardSection(b: BoardBooking): BoardSectionId {
  const s = b.status;
  if (s === "quote_requested" || s === "new") return "pending";
  if (s === "quoted") return isQuoteLost(b) ? "archive" : "quoted";
  if (s === "quote_approved") return "accepted";
  if (s === "scheduled" || s === "in_progress") return "scheduled";
  if (s === "completed") return "repaired";
  if (s === "declined" || s === "cancelled") return "not_accepted";
  if (s === "archived" || s === "lost") return "archive";
  return "archive";
}

export function statusLabel(status: string) {
  const map: Record<string, string> = {
    quote_requested: "Pending quote",
    quoted: "Quote sent",
    quote_approved: "Quote accepted",
    scheduled: "Scheduled",
    in_progress: "In progress",
    completed: "Repaired",
    cancelled: "Cancelled",
    declined: "Not accepted",
    archived: "Archived",
    lost: "Lost",
    new: "Pending quote",
    contacted: "Contacted",
  };
  return map[status] ?? status;
}
