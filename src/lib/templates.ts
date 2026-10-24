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

/** Daily quote-acceptance reminders (day 1–3 after quote sent, or until accepted) */
export function quoteReminderTemplates(vars: {
  customerName: string;
  quoteAmountCents: number;
  confirmationCode: string;
  serviceType?: string | null;
  quoteNotes?: string | null;
  quoteUrl: string;
  dayNumber: 1 | 2 | 3;
}) {
  const name = firstName(vars.customerName);
  const amount = formatMoney(vars.quoteAmountCents);
  const service =
    serviceLabel(vars.serviceType || "") || "paintless dent repair";
  const day = vars.dayNumber;

  const sms = [
    `Hi ${name}, your ${BUSINESS_NAME} quote for ${service} is ${amount}. Accept & pick a time: ${vars.quoteUrl} — Code ${vars.confirmationCode}`,
    `Hi ${name}, friendly reminder: your ${BUSINESS_NAME} quote (${amount}) is still open. Accept here: ${vars.quoteUrl} — Code ${vars.confirmationCode}`,
    `Hi ${name}, last reminder: your ${BUSINESS_NAME} quote for ${amount} expires after today. Accept & schedule: ${vars.quoteUrl} — Code ${vars.confirmationCode}`,
  ][day - 1];

  const emailSubject = [
    `Your ${BUSINESS_NAME} quote is ready (${amount})`,
    `Reminder: your ${BUSINESS_NAME} quote (${amount})`,
    `Final reminder: ${BUSINESS_NAME} quote ${amount}`,
  ][day - 1];

  const notesLine = vars.quoteNotes?.trim()
    ? `\n\nNotes from our team:\n${vars.quoteNotes.trim()}\n`
    : "\n";

  const intro =
    day === 1
      ? "Thanks for sending your vehicle photos. We've reviewed the damage and prepared your quote."
      : day === 2
        ? "Just a friendly reminder that your quote is still available."
        : "This is your final reminder — your quote will expire after today unless you accept.";

  const emailBody = `Hi ${name},

${intro}

Service: ${service}
Quote amount: ${amount}
Confirmation code: ${vars.confirmationCode}
${notesLine}
Accept your quote and choose an appointment time here:
${vars.quoteUrl}

Questions? Call us at ${PHONE}.

Thank you,
${OWNER_1_NAME}
${BUSINESS_NAME}
${PHONE}`;

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
