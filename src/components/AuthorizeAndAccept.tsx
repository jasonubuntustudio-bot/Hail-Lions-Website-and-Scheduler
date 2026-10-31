"use client";

import { useState } from "react";
import { Check, FileText } from "lucide-react";
import {
  authorizationSummaryBullets,
  formatMoneyCents,
} from "@/lib/authorization";

type Props = {
  code: string;
  fullName: string;
  phone: string;
  vehicleYear: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  quoteAmountCents: number | null;
  isInsurance?: boolean;
  claimNumber?: string | null;
  insuranceCompany?: string | null;
  onDone: () => void;
  onError: (msg: string) => void;
};

export default function AuthorizeAndAccept({
  code,
  fullName,
  phone,
  vehicleYear,
  vehicleMake,
  vehicleModel,
  quoteAmountCents,
  isInsurance,
  claimNumber,
  insuranceCompany,
  onDone,
  onError,
}: Props) {
  const [agreed, setAgreed] = useState(false);
  const [signerName, setSignerName] = useState(fullName || "");
  const [busy, setBusy] = useState(false);
  const [openFull, setOpenFull] = useState(false);

  const vehicle = [vehicleYear, vehicleMake, vehicleModel]
    .filter(Boolean)
    .join(" ");

  const submit = async () => {
    if (!agreed) {
      onError("You must agree to the repair authorization to continue.");
      return;
    }
    if (!signerName.trim()) {
      onError("Type your full legal name to sign.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/quote/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          signerName: signerName.trim(),
          agreed: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || "Could not save authorization");
        return;
      }
      onDone();
    } catch {
      onError("Network error — try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-cyan-500/30 bg-gray-950 p-4">
      <div className="flex items-start gap-3">
        <FileText className="mt-0.5 shrink-0 text-cyan-400" size={22} />
        <div>
          <h2 className="font-semibold text-white">
            Repair authorization (required)
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Texas work order, lien notice, vehicle operation permission, PDR
            risks, and limited insurance power of attorney. Your name and
            vehicle are filled from this quote.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-black/40 p-3 text-sm text-gray-300">
        <p>
          <span className="text-gray-500">Customer:</span> {fullName}
        </p>
        <p>
          <span className="text-gray-500">Phone:</span> {phone || "—"}
        </p>
        <p>
          <span className="text-gray-500">Vehicle:</span> {vehicle || "—"}
        </p>
        <p>
          <span className="text-gray-500">Amount:</span>{" "}
          {formatMoneyCents(quoteAmountCents)}
        </p>
        {(isInsurance || claimNumber || insuranceCompany) && (
          <p className="mt-1 text-amber-200/90">
            Insurance job
            {insuranceCompany ? ` · ${insuranceCompany}` : ""}
            {claimNumber ? ` · Claim ${claimNumber}` : ""}
          </p>
        )}
      </div>

      <ul className="list-disc space-y-1.5 pl-5 text-xs text-gray-400">
        {authorizationSummaryBullets().map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setOpenFull((v) => !v)}
        className="text-xs text-cyan-400 underline"
      >
        {openFull ? "Hide full terms" : "View full legal terms"}
      </button>
      {openFull && (
        <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-800 bg-gray-900 p-3 text-[11px] leading-relaxed text-gray-400">
          <p className="mb-2">
            By accepting you authorize Hail Lions LLC under Texas Property Code
            Chapter 70, grant permission to operate the vehicle for repair and
            testing, accept PDR/glue-pull paint risks (except gross negligence
            or willful misconduct), and if insurance applies, appoint Hail Lions
            as limited attorney-in-fact to receive, endorse, and deposit insurer
            checks and supplements for this repair—including after the vehicle is
            delivered. Full text is stored with your signed record.
          </p>
          <p>
            NOTICE: If the vehicle is released for a check, money order, or card
            payment that is stopped, dishonored, or reversed, the vehicle may be
            subject to repossession under Tex. Prop. Code § 70.001.
          </p>
        </div>
      )}

      <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-200">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-600"
        />
        <span>
          I have read and agree to the repair authorization, Texas lien and
          repossession notice, and limited insurance power of attorney. I am
          authorized to sign for this vehicle.
        </span>
      </label>

      <div>
        <label className="mb-1 block text-xs text-gray-400">
          Type full legal name to sign
        </label>
        <input
          type="text"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          autoComplete="name"
          className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white"
          placeholder="Full legal name"
        />
      </div>

      <button
        type="button"
        disabled={busy || !agreed}
        onClick={submit}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 font-bold text-black disabled:opacity-50"
      >
        <Check size={20} />
        {busy ? "Signing…" : "Sign & accept quote"}
      </button>
    </div>
  );
}
