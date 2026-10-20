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

/** Generate a short human code like HL-A7K2 */
export function makeConfirmationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "HL-";
  for (let i = 0; i < 4; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

export function serviceLabel(id: string) {
  return SERVICE_TYPES.find((s) => s.id === id)?.label ?? id;
}
