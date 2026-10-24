/**
 * Customer + admin alerts when status changes.
 * Works without SMS/email providers (logs). Wire Twilio/Resend via env later.
 */

type NotifyPayload = {
  toPhone?: string | null;
  toEmail?: string | null;
  confirmationCode: string;
  event:
    | "quote_requested"
    | "quoted"
    | "quote_approved"
    | "scheduled"
    | "declined";
  message: string;
};

export async function notifyCustomer(p: NotifyPayload) {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://hail-lions-website-and-scheduler.vercel.app";
  const link = `${site}/quote/${encodeURIComponent(p.confirmationCode)}`;
  const body = `${p.message}\n\nView status: ${link}`;

  console.info("[notify:customer]", {
    event: p.event,
    phone: p.toPhone,
    email: p.toEmail,
    code: p.confirmationCode,
  });

  // Optional webhook (Zapier / Make / n8n / custom)
  const hook = process.env.NOTIFY_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, body, link, channel: "customer" }),
      });
    } catch (e) {
      console.error("[notify] webhook failed", e);
    }
  }

  // Optional Twilio SMS
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (sid && token && from && p.toPhone) {
    try {
      const auth = Buffer.from(`${sid}:${token}`).toString("base64");
      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: p.toPhone,
            From: from,
            Body: body.slice(0, 1500),
          }),
        }
      );
    } catch (e) {
      console.error("[notify] twilio failed", e);
    }
  }

  return { ok: true, link };
}

export async function notifyAdmin(p: {
  event: string;
  confirmationCode: string;
  fullName: string;
  phone: string;
  photoCount: number;
  message: string;
}) {
  console.info("[notify:admin]", p);
  const hook = process.env.ADMIN_NOTIFY_WEBHOOK_URL || process.env.NOTIFY_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, channel: "admin" }),
      });
    } catch (e) {
      console.error("[notify] admin webhook failed", e);
    }
  }
}
