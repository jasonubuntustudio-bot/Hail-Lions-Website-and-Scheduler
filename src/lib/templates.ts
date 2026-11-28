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
 * Business-letter style estimate for SMS / copy-paste.
 * SMS cannot use real bold fonts — structure + CAPS headers read clearly on phones.
 */
export function customerEstimateLetter(vars: {
  customerName: string;
  /** Display string already formatted, e.g. "$350 – $550" or "$450" or "$___ – $___" */
  amountDisplay: string;
  quoteUrl: string;
  confirmationCode?: string | null;
  vehicleSummary?: string | null;
}): string {
  const fullName = vars.customerName.trim() || "Valued Customer";
  const name = firstName(fullName);
  const vehicle = vars.vehicleSummary?.trim();
  const code = vars.confirmationCode?.trim();

  return [
    `HAIL LIONS`,
    `Mobile Paintless Dent Repair`,
    ``,
    `Dear ${name},`,
    ``,
    `Thank you for considering Hail Lions for your dent repair needs.`,
    `We have inspected your photos of the damage.`,
    ``,
    `--------------------------------`,
    `ESTIMATE`,
    `${vars.amountDisplay}`,
    vehicle ? `Vehicle: ${vehicle}` : null,
    code ? `Reference: ${code}` : null,
    `--------------------------------`,
    ``,
    `If you would like to move forward with this repair, please use the approval link below. You may pick a day, time, and location that is convenient for you.`,
    ``,
    `TO ACCEPT AND SCHEDULE:`,
    `${vars.quoteUrl}`,
    ``,
    `If you have any questions, please call us at ${PHONE}.`,
    ``,
    `Sincerely,`,
    ``,
    `${OWNER_1_NAME}`,
    `Hail Lions`,
    `${PHONE}`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/**
 * Customer estimate / quote message — business letter format.
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
  const fullName = vars.customerName.trim() || "Valued Customer";
  const name = firstName(vars.customerName);
  const low = formatMoney(vars.quoteAmountCents);
  const hasRange =
    vars.quoteHighCents != null &&
    vars.quoteHighCents > vars.quoteAmountCents;
  const high = hasRange ? formatMoney(vars.quoteHighCents!) : null;
  const amountDisplay = hasRange ? `${low} – ${high}` : low;
  const amountPhrase = hasRange ? `between ${low} and ${high}` : low;
  const service =
    serviceLabel(vars.serviceType || "") || "paintless dent repair";
  const vehicle = vars.vehicleSummary?.trim();
  const day = vars.dayNumber;
  const acceptUrl = vars.quoteUrl;

  const notesBlock = vars.quoteNotes?.trim()
    ? `\n\nNotes from our team:\n${vars.quoteNotes.trim()}`
    : "";

  const vehicleLine = vehicle ? `\nVehicle: ${vehicle}` : "";

  // --- Business letter (email) ---
  const emailBodyDay1 = `HAIL LIONS
Mobile Paintless Dent Repair

Dear ${fullName},

Thank you for considering Hail Lions for your dent repair needs. We appreciate the opportunity to earn your business.

We have inspected your photos of the damage. Based on the information provided, your estimated repair cost is ${amountPhrase}.${vehicleLine}

Service: ${service}
Confirmation code: ${vars.confirmationCode}${notesBlock}

If you would like to move forward with this repair, please use the approval link below. You may pick a day, time, and location that is convenient for you.

TO ACCEPT AND SCHEDULE:
${acceptUrl}

If you have any questions, please call us at ${PHONE}.

Sincerely,

${OWNER_1_NAME}
Hail Lions
${PHONE}`;

  const emailBodyDay2 = `HAIL LIONS
Mobile Paintless Dent Repair

Dear ${name},

This is a friendly reminder that your estimate of ${amountPhrase} is still available.

Confirmation code: ${vars.confirmationCode}

TO ACCEPT AND SCHEDULE:
${acceptUrl}

If you have any questions, please call us at ${PHONE}.

Sincerely,

${OWNER_1_NAME}
Hail Lions
${PHONE}`;

  const emailBodyDay3 = `HAIL LIONS
Mobile Paintless Dent Repair

Dear ${name},

This is a final reminder regarding your Hail Lions estimate of ${amountPhrase}. After today, this quote may no longer be held without an update from our team.

Confirmation code: ${vars.confirmationCode}

TO ACCEPT AND SCHEDULE:
${acceptUrl}

Thank you again for considering Hail Lions.

Sincerely,

${OWNER_1_NAME}
Hail Lions
${PHONE}`;

  const emailBody = [emailBodyDay1, emailBodyDay2, emailBodyDay3][day - 1];

  const emailSubject = [
    `Your ${BUSINESS_NAME} estimate — ${hasRange ? `${low}–${high}` : low}`,
    `Reminder: your ${BUSINESS_NAME} estimate (${hasRange ? `${low}–${high}` : low})`,
    `Final reminder: ${BUSINESS_NAME} estimate ${hasRange ? `${low}–${high}` : low}`,
  ][day - 1];

  // SMS: full business-letter layout (primary day); shorter reminders for day 2/3
  const smsDay1 = customerEstimateLetter({
    customerName: fullName,
    amountDisplay,
    quoteUrl: acceptUrl,
    confirmationCode: vars.confirmationCode,
    vehicleSummary: vehicle,
  });

  const sms = [
    smsDay1,
    [
      `HAIL LIONS`,
      ``,
      `Dear ${name},`,
      ``,
      `Reminder: your estimate (${amountDisplay}) is still open.`,
      ``,
      `TO ACCEPT AND SCHEDULE:`,
      acceptUrl,
      ``,
      `Sincerely,`,
      `Hail Lions · ${PHONE}`,
    ].join("\n"),
    [
      `HAIL LIONS`,
      ``,
      `Dear ${name},`,
      ``,
      `Final reminder: your estimate of ${amountDisplay}.`,
      ``,
      `TO ACCEPT AND SCHEDULE:`,
      acceptUrl,
      ``,
      `Sincerely,`,
      `Hail Lions · ${PHONE}`,
    ].join("\n"),
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
