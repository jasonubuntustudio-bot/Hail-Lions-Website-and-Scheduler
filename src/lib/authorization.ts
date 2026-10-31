/**
 * Texas repair authorization + limited insurance POA text for e-sign.
 * Not legal advice — have counsel review before production use.
 */

export type AuthFill = {
  confirmationCode: string;
  fullName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  vehicleYear?: string | null;
  vehicleMake?: string | null;
  vehicleModel?: string | null;
  vehicleColor?: string | null;
  vin?: string | null;
  serviceType?: string | null;
  quoteAmountCents?: number | null;
  quoteNotes?: string | null;
  isInsurance?: boolean;
  claimNumber?: string | null;
  insuranceCompany?: string | null;
  serviceDate?: string | null;
};

export function formatMoneyCents(cents: number | null | undefined) {
  if (cents == null) return "Per accepted quote";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function buildAuthorizationHtml(
  data: AuthFill,
  opts: {
    signerName: string;
    signedAtIso: string;
    signatureDataUrl?: string | null;
    ip?: string | null;
  }
) {
  const vehicle = [data.vehicleYear, data.vehicleMake, data.vehicleModel]
    .filter(Boolean)
    .join(" ");
  const amount = formatMoneyCents(data.quoteAmountCents);
  const signedLocal = new Date(opts.signedAtIso).toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Hail Lions — Repair Authorization ${data.confirmationCode}</title>
<style>
  body { font-family: Georgia, Times, serif; font-size: 12px; line-height: 1.45; color: #111; max-width: 720px; margin: 24px auto; padding: 0 16px; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  h2 { font-size: 13px; margin: 18px 0 6px; border-bottom: 1px solid #333; padding-bottom: 2px; }
  .meta { color: #444; font-size: 11px; margin-bottom: 16px; }
  .box { background: #fff8e6; border: 1px solid #c9a227; padding: 10px; margin: 10px 0; }
  .sig img { max-height: 80px; border-bottom: 1px solid #333; }
  .small { font-size: 10px; color: #555; }
</style>
</head>
<body>
  <h1>HAIL LIONS LLC — Repair Authorization &amp; Work Order</h1>
  <p class="meta">Mobile Paintless Dent Repair · Greater Houston, TX · (281) 352-5434 · Confirmation <strong>${escapeHtml(data.confirmationCode)}</strong></p>
  <p class="small">Electronically signed under the Texas Uniform Electronic Transactions Act. Keep a copy for your records. This document is not a substitute for advice from a licensed Texas attorney.</p>

  <h2>1. Customer &amp; vehicle</h2>
  <p>
    <strong>Name:</strong> ${escapeHtml(data.fullName)}<br/>
    <strong>Phone:</strong> ${escapeHtml(data.phone || "—")}<br/>
    <strong>Email:</strong> ${escapeHtml(data.email || "—")}<br/>
    <strong>Address:</strong> ${escapeHtml(data.address || "—")}<br/>
    <strong>Vehicle:</strong> ${escapeHtml(vehicle || "—")} ${data.vehicleColor ? `(${escapeHtml(data.vehicleColor)})` : ""}<br/>
    <strong>VIN:</strong> ${escapeHtml(data.vin || "—")}<br/>
    <strong>Service:</strong> ${escapeHtml(data.serviceType || "PDR / hail")}<br/>
    <strong>Authorized amount:</strong> ${escapeHtml(amount)}<br/>
    ${data.quoteNotes ? `<strong>Notes:</strong> ${escapeHtml(data.quoteNotes)}<br/>` : ""}
    <strong>Insurance job:</strong> ${data.isInsurance ? "Yes" : "No / customer-pay"}
    ${data.insuranceCompany ? ` · <strong>Carrier:</strong> ${escapeHtml(data.insuranceCompany)}` : ""}
    ${data.claimNumber ? ` · <strong>Claim #:</strong> ${escapeHtml(data.claimNumber)}` : ""}
  </p>

  <h2>2. Authorization to perform services</h2>
  <p>I am the owner of the vehicle described above, or I am authorized by the owner to bind the owner. I authorize Hail Lions LLC, its owners, employees, agents, and independent contractors (“Hail Lions”) to inspect, diagnose, photograph, and perform paintless dent repair (PDR) and related services, including push-to-paint and glue-pull methods, use of tools, temporary removal of interior trim or access panels when reasonably necessary, and reinstallation of removed components. Scope of work is as set out in the written estimate/quote I accepted (including approved supplements). Hail Lions will obtain my approval before work that materially increases the price I owe beyond the authorized amount, except minor incidental steps reasonably necessary to complete authorized work.</p>

  <h2>3. Permission to operate the vehicle</h2>
  <p>I grant Hail Lions and its employees permission to operate the vehicle on public roads, private roads, driveways, parking lots, and at my residence or other private property, solely for purposes reasonably related to the services, including positioning for repair, inspection, testing, verification, short road tests, and delivery or relocation incidental to mobile service. Operation shall be by licensed drivers in a careful manner.</p>

  <h2>4. PDR process risks (including glue-pull / paint lift)</h2>
  <p>I understand PDR may include glue-pulling. Factory paint, clear coat, prior repairs, aftermarket paint, coatings, wraps, or aged finishes can fail, lift, delaminate, crack, or mark. Hail Lions will use reasonable professional care; however, <strong>I accept the inherent risk</strong> that paint, clear coat, or coatings may detach or fail during or after PDR, and I will not hold Hail Lions liable for such paint/coating failure or refinishing costs, except to the extent caused by Hail Lions’ gross negligence or willful misconduct (to the maximum extent permitted by Texas law).</p>

  <h2>5. Personal property</h2>
  <p>I will remove valuables and personal items before service. Hail Lions is not responsible for loss of personal property left in the vehicle, or for loss/damage from fire, theft, weather, or causes beyond Hail Lions’ reasonable control, except as required by Texas law for Hail Lions’ own negligence where limitation is not permitted.</p>

  <h2>6. Payment</h2>
  <p>Payment for authorized work is due upon completion unless otherwise agreed in writing. I remain responsible for deductibles, betterment, depreciation, and any amounts insurance does not pay. Returned or reversed payments do not satisfy the debt.</p>

  <h2>7. Texas worker’s / mechanic’s possessory lien (Tex. Prop. Code § 70.001)</h2>
  <p>I acknowledge that under Texas Property Code § 70.001, a worker who by labor repairs a vehicle may retain possession until the amount due under the contract is paid (or reasonable and usual compensation if no amount is specified). An express worker’s/mechanic’s lien is acknowledged on the vehicle to secure payment of authorized charges. Hail Lions may pursue remedies under Chapter 70 of the Texas Property Code, including notice and sale procedures under § 70.006 when lawful.</p>

  <div class="box">
    <h2 style="margin-top:0;border:none;">8. Notice of possible repossession if payment is dishonored (Tex. Prop. Code § 70.001(c))</h2>
    <p><strong>NOTICE: IF THIS VEHICLE IS RELEASED TO ME IN EXCHANGE FOR A CHECK, MONEY ORDER, OR CREDIT/DEBIT CARD PAYMENT THAT IS LATER STOPPED, DISHONORED, OR REVERSED, THE VEHICLE MAY BE SUBJECT TO REPOSSESSION UNDER TEXAS PROPERTY CODE SECTION 70.001. BY ELECTRONICALLY SIGNING THIS DOCUMENT I ACKNOWLEDGE THIS REPOSSESSION NOTICE.</strong></p>
  </div>

  <h2>9. Insurance communication &amp; limited power of attorney (direction to pay)</h2>
  <p>If an insurer is involved, I authorize Hail Lions to communicate with the insurer and provide photos, estimates, supplements, and documentation related to this claim/repair.</p>
  <p><strong>Limited power of attorney / direction to pay:</strong> I appoint Hail Lions LLC as my limited attorney-in-fact solely to: (a) request that insurance payments, drafts, and supplement checks related to this repair be made payable to Hail Lions LLC or jointly to Hail Lions LLC and me; (b) receive, endorse, and deposit any check, draft, or instrument issued by an insurer for labor, parts, or supplements for this vehicle/repair, including when the vehicle has already been delivered to me before a supplement check arrives; and (c) apply those funds to the balance owed for authorized repairs. This power is limited to insurance proceeds for this repair engagement, does not authorize sale of the vehicle or unrelated acts, and ends when the account for this job is paid in full or this authorization is revoked in writing (revocation does not affect instruments already processed in good faith). I remain responsible for deductibles and unpaid balances.</p>

  <h2>10. Governing law</h2>
  <p>Governed by the laws of the State of Texas. Venue in Harris County, Texas, or the Texas county where services were performed, unless mandatory law requires otherwise. Severability applies. Electronic signatures are intended to be valid under the Texas Uniform Electronic Transactions Act.</p>

  <h2>Electronic signature</h2>
  <p>
    <strong>Signer name:</strong> ${escapeHtml(opts.signerName)}<br/>
    <strong>Signed (Central Time):</strong> ${escapeHtml(signedLocal)}<br/>
    <strong>ISO timestamp:</strong> ${escapeHtml(opts.signedAtIso)}
    ${opts.ip ? `<br/><strong>IP (if recorded):</strong> ${escapeHtml(opts.ip)}` : ""}
  </p>
  <div class="sig">
    ${
      opts.signatureDataUrl
        ? `<p>Signature image:</p><img src="${opts.signatureDataUrl}" alt="Signature"/>`
        : `<p>Typed signature: <strong>${escapeHtml(opts.signerName)}</strong></p>`
    }
  </div>
  <p class="small">Document generated by Hail Lions scheduling system. Stored with the booking record.</p>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Plain-text summary shown in the on-screen consent box */
export function authorizationSummaryBullets(): string[] {
  return [
    "Authorize Hail Lions to perform the quoted PDR / hail work on my vehicle.",
    "Allow licensed employees to operate the vehicle for repair, testing, and mobile service (roads, shop, or private property).",
    "Accept PDR risks including possible paint or clear-coat lift during glue-pull methods.",
    "Acknowledge a Texas worker’s/mechanic’s lien (Prop. Code § 70.001) on authorized charges and repossession notice if payment is dishonored.",
    "If insurance is involved: limited power of attorney for Hail Lions to receive, endorse, and deposit insurer checks/supplements for this repair (including after vehicle delivery).",
    "I am responsible for deductibles and any amount insurance does not pay.",
  ];
}
