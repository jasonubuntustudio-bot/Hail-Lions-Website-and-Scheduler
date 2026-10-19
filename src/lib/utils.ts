import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PHONE = "(281) 352-5434";
export const PHONE_TEL = "+12813525434";
export const BUSINESS_NAME = "Hail Lions";
export const TAGLINE = "The King of Dent Repair";
