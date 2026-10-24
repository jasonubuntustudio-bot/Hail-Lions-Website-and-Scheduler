/** Normalize US-ish phone to digits for matching */
export function normalizePhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) return d.slice(1);
  return d;
}

export function displayPhone(phone: string) {
  const d = normalizePhone(phone);
  if (d.length === 10) {
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return phone;
}

export const INTERACTION_CHANNELS = [
  { id: "note", label: "Note" },
  { id: "call", label: "Call" },
  { id: "sms", label: "SMS" },
  { id: "email", label: "Email" },
  { id: "quote", label: "Quote" },
  { id: "schedule", label: "Schedule" },
  { id: "visit", label: "On-site visit" },
] as const;
