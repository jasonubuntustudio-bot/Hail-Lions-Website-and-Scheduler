/**
 * Customer + admin alerts: SMS (Twilio) + email (Resend).
 * Without provider env vars, messages are logged only.
 *
 * Recommended low-cost mode (no customer 10DLC):
 *   ADMIN_PHONE = your cell — you get new leads + photo counts
 *   CUSTOMER_SMS_ENABLED = false — you text the customer yourself
 *
 * SMS env (Twilio):
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
 *   CUSTOMER_SMS_ENABLED = "true" only after 10DLC is approved
 *
 * Email env (optional):
 *   RESEND_API_KEY, EMAIL_FROM
 *
 * Admin env:
 *   ADMIN_PHONE (required for lead alerts), ADMIN_EMAIL
 */

import { BUSINESS_NAME, PHONE } from "@/lib/utils";

export type NotifyEvent =
  | "quote_requested"
  | "quoted"
  | "quote_approved"
  | "scheduled"
  | "declined";

type NotifyPayload = {
  toPhone?: string | null;
  toEmail?: string | null;
  confirmationCode: string;
  event: NotifyEvent;
  message: string;
  /** Optional richer email */
  emailSubject?: string;
  emailBody?: string;
  /** Prefer this for SMS if set */
  smsBody?: string;
};

function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://hail-lions-website-and-scheduler.vercel.app"
  ).replace(/\/$/, "");
}

/** Normalize US phones to E.164 (+1…) for Twilio */
export function toE164(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (phone.trim().startsWith("+") && digits.length >= 10) return `+${digits}`;
  return null;
}

async function sendSms(to: string, body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) {
    console.info("[notify:sms:skip]", {
      reason: "Twilio not configured (need TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER)",
      to,
    });
    return false;
  }
  const e164 = toE164(to);
  if (!e164) {
    console.warn("[notify:sms] invalid phone", to);
    return false;
  }
  try {
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: e164,
          From: toE164(from) || from,
          Body: body.slice(0, 1500),
        }),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("[notify:sms] twilio error", res.status, text.slice(0, 300));
      return false;
    }
    console.info("[notify:sms] sent", e164);
    return true;
  } catch (e) {
    console.error("[notify:sms] failed", e);
    return false;
  }
}

async function sendEmail(
  to: string,
  subject: string,
  text: string
): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM ||
    "Hail Lions <onboarding@resend.dev>";
  if (!key) {
    console.info("[notify:email:skip]", { reason: "Resend not configured", to });
    return false;
  }
  if (!to.includes("@")) {
    console.warn("[notify:email] invalid address", to);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to.trim()],
        subject,
        text,
      }),
    });
    if (!res.ok) {
      const textBody = await res.text();
      console.error("[notify:email] resend error", res.status, textBody.slice(0, 300));
      return false;
    }
    console.info("[notify:email] sent", to);
    return true;
  } catch (e) {
    console.error("[notify:email] failed", e);
    return false;
  }
}

async function postWebhook(url: string, payload: unknown) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("[notify] webhook failed", e);
  }
}

export async function notifyCustomer(p: NotifyPayload) {
  const link = `${siteUrl()}/quote/${encodeURIComponent(p.confirmationCode)}`;
  const sms =
    p.smsBody ||
    `${p.message}\n\nView / respond: ${link}`;
  const emailSubject =
    p.emailSubject || `${BUSINESS_NAME} — ${p.confirmationCode}`;
  const emailBody =
    p.emailBody ||
    `${p.message}\n\nView status and respond:\n${link}\n\nQuestions? Call ${PHONE}.\n\n— ${BUSINESS_NAME}`;

  console.info("[notify:customer]", {
    event: p.event,
    phone: p.toPhone,
    email: p.toEmail,
    code: p.confirmationCode,
  });

  const hook = process.env.NOTIFY_WEBHOOK_URL;
  if (hook) {
    await postWebhook(hook, {
      ...p,
      link,
      sms,
      emailSubject,
      emailBody,
      channel: "customer",
    });
  }

  const results = {
    sms: false,
    email: false,
    link,
  };

  // Customer SMS only when explicitly enabled (needs 10DLC for real customers).
  const customerSmsOn =
    (process.env.CUSTOMER_SMS_ENABLED || "").toLowerCase() === "true";
  if (p.toPhone && customerSmsOn) {
    results.sms = await sendSms(p.toPhone, sms);
  } else if (p.toPhone && !customerSmsOn) {
    console.info("[notify:sms:skip]", {
      reason: "CUSTOMER_SMS_ENABLED is not true — admin texts customers manually",
      to: p.toPhone,
    });
  }
  if (p.toEmail) {
    results.email = await sendEmail(p.toEmail, emailSubject, emailBody);
  }

  return { ok: true, ...results };
}

export async function notifyAdmin(p: {
  event: string;
  confirmationCode: string;
  fullName: string;
  phone: string;
  photoCount?: number;
  message: string;
  vehicle?: string | null;
  address?: string | null;
}) {
  console.info("[notify:admin]", p);

  const hook =
    process.env.ADMIN_NOTIFY_WEBHOOK_URL || process.env.NOTIFY_WEBHOOK_URL;
  if (hook) {
    await postWebhook(hook, { ...p, channel: "admin" });
  }

  const adminPhone = process.env.ADMIN_PHONE || PHONE;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminUrl = `${siteUrl()}/admin`;
  const quoteUrl = `${siteUrl()}/quote/${encodeURIComponent(p.confirmationCode)}`;
  const firstName = (p.fullName || "there").trim().split(/\s+/)[0] || "there";

  // Ready-to-forward customer text: fill $AMOUNT only, then send to their number
  const customerTemplate = [
    `Hi ${firstName},`,
    ``,
    `Thank you for considering Hail Lions for your dent repair needs.`,
    `We have inspected your photos of the damage.`,
    ``,
    `Your estimate is $AMOUNT.`,
    ``,
    `To ACCEPT and pick a time, open this link:`,
    `${quoteUrl}`,
    ``,
    `To decline, reply DECLINE or ignore this message.`,
    `Questions? Call ${PHONE}.`,
    ``,
    `— Hail Lions`,
  ].join("\n");

  const sms = [
    `NEW LEAD → text this customer`,
    `To: ${p.phone}`,
    `${p.fullName}${p.vehicle ? ` · ${p.vehicle}` : ""}`,
    p.address ? `Loc: ${p.address}` : null,
    `Photos: ${p.photoCount ?? 0} · Code ${p.confirmationCode}`,
    `Admin photos: ${adminUrl}`,
    ``,
    `--- COPY BELOW, fill $___ – $___, send ---`,
    customerTemplate,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const subject = `${BUSINESS_NAME}: ${p.event} ${p.confirmationCode}`;
  const emailBody = `${p.message}

Customer: ${p.fullName}
Phone: ${p.phone}
Vehicle: ${p.vehicle || "—"}
Address: ${p.address || "—"}
Photos: ${p.photoCount ?? "—"}
Code: ${p.confirmationCode}

Admin (photos): ${adminUrl}

——— Copy & text the customer (fill $___ – $___) ———
${customerTemplate}
`;

  if (adminPhone) await sendSms(adminPhone, sms.slice(0, 1500));
  if (adminEmail) await sendEmail(adminEmail, subject, emailBody);

  return { ok: true };
}
