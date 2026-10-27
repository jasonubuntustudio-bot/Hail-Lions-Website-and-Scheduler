/**
 * Customer + admin alerts: SMS (Twilio) + email (Resend).
 * Without provider env vars, messages are logged only.
 *
 * Customer env:
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
 *   RESEND_API_KEY, EMAIL_FROM (e.g. "Hail Lions <quotes@yourdomain.com>")
 *
 * Admin env (optional):
 *   ADMIN_PHONE, ADMIN_EMAIL
 *   ADMIN_NOTIFY_WEBHOOK_URL or NOTIFY_WEBHOOK_URL
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
    console.info("[notify:sms:skip]", { reason: "Twilio not configured", to });
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
          From: from,
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

  if (p.toPhone) {
    results.sms = await sendSms(p.toPhone, sms);
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
}) {
  console.info("[notify:admin]", p);

  const hook =
    process.env.ADMIN_NOTIFY_WEBHOOK_URL || process.env.NOTIFY_WEBHOOK_URL;
  if (hook) {
    await postWebhook(hook, { ...p, channel: "admin" });
  }

  const adminPhone = process.env.ADMIN_PHONE || PHONE;
  const adminEmail = process.env.ADMIN_EMAIL;

  const sms = `${BUSINESS_NAME} admin: ${p.message} Code ${p.confirmationCode}. Customer ${p.fullName} ${p.phone}`;
  const subject = `${BUSINESS_NAME}: ${p.event} ${p.confirmationCode}`;
  const emailBody = `${p.message}

Code: ${p.confirmationCode}
Customer: ${p.fullName}
Phone: ${p.phone}
Photos: ${p.photoCount ?? "—"}
Event: ${p.event}

Open admin: ${siteUrl()}/admin
`;

  if (adminPhone) await sendSms(adminPhone, sms.slice(0, 1500));
  if (adminEmail) await sendEmail(adminEmail, subject, emailBody);

  return { ok: true };
}
