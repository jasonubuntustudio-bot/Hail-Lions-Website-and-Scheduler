import { BUSINESS_NAME, OWNER_1_NAME, PHONE } from "@/lib/utils";
import { formatMoney, serviceLabel } from "@/lib/booking";

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

function formatDateLong(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatLocation(
  address?: string | null,
  city?: string | null,
  zip?: string | null
) {
  const parts = [address, city, zip].filter(Boolean);
  return parts.length ? parts.join(", ") : "your location";
}

function techLine(name?: string | null, phone?: string | null) {
  const techName = name?.trim() || OWNER_1_NAME;
  const techPhone = phone?.trim() || PHONE;
  return `${techName} (${techPhone})`;
}

/**
 * Customer estimate / quote message — matches Hail Lions
 * “Customer Estimate & Appointment Template.”
 * Auto-fills name, amount (or optional low–high range), and ACCEPT URL.
 */
export function quoteReminderTemplates(vars: {
  customerName: string;
  quoteAmountCents: number;
  /** Optional upper bound for a range quote; omit for a single amount */
  quoteHighCents?: number | null;
  confirmationCode: string;
  serviceType?: string | null;
  quoteNotes?: string | null;
  quoteUrl: string;
  dayNumber: 1 | 2 | 3;
  vehicleSummary?: string | null;
}) {
  const fullName = vars.customerName.trim() || "there";
  const name = firstName(vars.customerName);
  const low = formatMoney(vars.quoteAmountCents);
  const hasRange =
    vars.quoteHighCents != null &&
    vars.quoteHighCents > vars.quoteAmountCents;
  const high = hasRange ? formatMoney(vars.quoteHighCents!) : null;
  const amountPhrase = hasRange
    ? `between ${low} and ${high}`
    : low;
  const service =
    serviceLabel(vars.serviceType || "") || "paintless dent repair";
  const vehicle = vars.vehicleSummary?.trim();
  const day = vars.dayNumber;
  const acceptUrl = vars.quoteUrl;

  const notesBlock = vars.quoteNotes?.trim()
    ? `\n\nNotes from our team:\n${vars.quoteNotes.trim()}`
    : "";

  const vehicleLine = vehicle ? `\nVehicle: ${vehicle}` : "";

  // --- Day 1: primary estimate (template style) ---
  const emailBodyDay1 = `Good day, ${fullName}!

This is ${OWNER_1_NAME} with ${BUSINESS_NAME}.

First, I'd like to thank you for considering ${BUSINESS_NAME} for your vehicle repairs. We appreciate the opportunity to earn your business!

Based on the information provided, your estimated repair cost is ${amountPhrase}.${vehicleLine}

Service: ${service}
Confirmation code: ${vars.confirmationCode}${notesBlock}

If you'd like to move forward with your repairs, simply open the link below to ACCEPT your quote. From there, you can select the appointment date and time that are most convenient for you.

ACCEPT & schedule:
${acceptUrl}

We look forward to taking care of your vehicle!

${OWNER_1_NAME}
${BUSINESS_NAME}
${PHONE}`;

  const emailBodyDay2 = `Good day, ${name}!

This is ${OWNER_1_NAME} with ${BUSINESS_NAME}.

Just a friendly reminder that your estimate of ${amountPhrase} is still available.

Confirmation code: ${vars.confirmationCode}

To ACCEPT your quote and choose an appointment time, please use this link:
${acceptUrl}

We look forward to taking care of your vehicle!

${OWNER_1_NAME}
${BUSINESS_NAME}
${PHONE}`;

  const emailBodyDay3 = `Good day, ${name}!

This is ${OWNER_1_NAME} with ${BUSINESS_NAME}.

This is a final reminder regarding your ${BUSINESS_NAME} estimate of ${amountPhrase}. After today, this quote may no longer be held without an update from our team.

Confirmation code: ${vars.confirmationCode}

If you'd like to move forward, please ACCEPT and schedule here:
${acceptUrl}

Thank you again for considering ${BUSINESS_NAME}.

${OWNER_1_NAME}
${BUSINESS_NAME}
${PHONE}`;

  const emailBody = [emailBodyDay1, emailBodyDay2, emailBodyDay3][day - 1];

  const emailSubject = [
    `Your ${BUSINESS_NAME} estimate — ${hasRange ? `${low}–${high}` : low}`,
    `Reminder: your ${BUSINESS_NAME} estimate (${hasRange ? `${low}–${high}` : low})`,
    `Final reminder: ${BUSINESS_NAME} estimate ${hasRange ? `${low}–${high}` : low}`,
  ][day - 1];

  // SMS stays short; same facts as the template
  const sms = [
    `Good day, ${name}! Jason with ${BUSINESS_NAME}. Your estimated repair cost is ${amountPhrase}. ACCEPT & schedule: ${acceptUrl} — Code ${vars.confirmationCode}`,
    `Hi ${name}, reminder from ${BUSINESS_NAME}: your estimate (${amountPhrase}) is still open. ACCEPT: ${acceptUrl} — ${vars.confirmationCode}`,
    `Hi ${name}, final reminder: ${BUSINESS_NAME} estimate ${amountPhrase}. ACCEPT & schedule today: ${acceptUrl} — ${vars.confirmationCode}`,
  ][day - 1];

  return { sms, emailSubject, emailBody };
}

export function appointmentConfirmationTemplates(vars: {
  customerName: string;
  confirmationCode: string;
  scheduledDate: string;
  scheduledWindow: string;
  address?: string | null;
  city?: string | null;
  zip?: string | null;
  technicianName?: string | null;
  technicianPhone?: string | null;
  serviceType?: string | null;
  quoteAmountCents?: number | null;
}) {
  const name = firstName(vars.customerName);
  const when = `${formatDateLong(vars.scheduledDate)} · ${vars.scheduledWindow}`;
  const where = formatLocation(vars.address, vars.city, vars.zip);
  const tech = techLine(vars.technicianName, vars.technicianPhone);
  const amount =
    vars.quoteAmountCents != null ? formatMoney(vars.quoteAmountCents) : null;
  const service =
    serviceLabel(vars.serviceType || "") || "paintless dent repair";

  const sms = `Hi ${name}, your ${BUSINESS_NAME} appointment is confirmed for ${when} at ${where}. Tech: ${tech}. Code ${vars.confirmationCode}${amount ? ` · Quote ${amount}` : ""}`;

  const emailSubject = `${BUSINESS_NAME} appointment confirmed — ${formatDateLong(vars.scheduledDate)}`;

  const emailBody = `Hi ${name},

Your appointment is confirmed.

Service: ${service}
Date & time: ${when}
Location: ${where}
Technician: ${tech}
Confirmation code: ${vars.confirmationCode}${amount ? `\nQuote amount: ${amount}` : ""}

We'll see you then. If you need to reschedule, call ${PHONE}.

Thank you,
${OWNER_1_NAME}
${BUSINESS_NAME}
${PHONE}`;

  return { sms, emailSubject, emailBody };
}

export function appointmentReminderTemplates(
  vars: {
    customerName: string;
    confirmationCode: string;
    scheduledDate: string;
    scheduledWindow: string;
    address?: string | null;
    city?: string | null;
    zip?: string | null;
    technicianName?: string | null;
    technicianPhone?: string | null;
    serviceType?: string | null;
  },
  kind: "24h" | "1h"
) {
  const name = firstName(vars.customerName);
  const when = `${formatDateLong(vars.scheduledDate)} · ${vars.scheduledWindow}`;
  const where = formatLocation(vars.address, vars.city, vars.zip);
  const tech = techLine(vars.technicianName, vars.technicianPhone);
  const service =
    serviceLabel(vars.serviceType || "") || "paintless dent repair";

  if (kind === "24h") {
    return {
      sms: `Hi ${name}, reminder: ${BUSINESS_NAME} is coming tomorrow ${when} at ${where}. Tech: ${tech}. Code ${vars.confirmationCode}`,
      emailSubject: `Reminder: ${BUSINESS_NAME} appointment tomorrow`,
      emailBody: `Hi ${name},

This is a reminder that your appointment is tomorrow.

Service: ${service}
Date & time: ${when}
Location: ${where}
Technician: ${tech}
Confirmation code: ${vars.confirmationCode}

If you need to reschedule, call ${PHONE}.

Thank you,
${OWNER_1_NAME}
${BUSINESS_NAME}
${PHONE}`,
    };
  }

  return {
    sms: `Hi ${name}, ${BUSINESS_NAME} is on the way in about 1 hour. ${when} at ${where}. Tech: ${tech}. Code ${vars.confirmationCode}`,
    emailSubject: `Reminder: ${BUSINESS_NAME} arrives in about 1 hour`,
    emailBody: `Hi ${name},

This is a reminder that your technician is expected in about 1 hour.

Service: ${service}
Date & time: ${when}
Location: ${where}
Technician: ${tech}
Confirmation code: ${vars.confirmationCode}

See you soon.
${OWNER_1_NAME}
${BUSINESS_NAME}
${PHONE}`,
  };
}
