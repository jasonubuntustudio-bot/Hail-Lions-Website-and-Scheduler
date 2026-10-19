import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PHONE = "(281) 352-5434";
export const PHONE_TEL = "+12813525434";
export const BUSINESS_NAME = "Hail Lions";
export const TAGLINE = "The King of Dent Repair";

/** Primary owner */
export const OWNER_1_NAME = "Jason Huddleston";
export const OWNER_1_TITLE = "CEO / Co-Owner";

/**
 * Second owner — replace placeholders when ready.
 */
export const OWNER_2_NAME = "[Second Owner Name]";
export const OWNER_2_TITLE = "Co-Owner";
export const OWNER_2_PHONE = ""; // optional, e.g. "(281) 555-0000"
export const OWNER_2_PHONE_TEL = ""; // e.g. "+12815550000"
