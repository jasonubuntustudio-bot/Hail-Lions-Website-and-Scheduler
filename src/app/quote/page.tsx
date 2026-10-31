"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, FileText, Phone } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

/** Normalize user input to HL-XXXX style */
function normalizeCode(raw: string) {
  let s = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!s) return "";
  if (!s.startsWith("HL")) {
    // allow bare 4 chars
    s = s.replace(/^-+/, "");
    if (/^[A-Z0-9]{4}$/.test(s)) s = `HL-${s}`;
    else if (/^[A-Z0-9]{4,}$/.test(s)) s = `HL-${s.slice(0, 4)}`;
  }
  if (s.startsWith("HL") && !s.startsWith("HL-")) {
    s = `HL-${s.slice(2).replace(/^-+/, "")}`;
  }
  return s;
}

export default function QuoteLookupPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const go = async (e?: FormEvent) => {
    e?.preventDefault();
    setError("");
    const normalized = normalizeCode(code);
    if (!normalized || normalized.length < 6) {
      setError("Enter your confirmation code (example: HL-A3K9).");
      return;
    }
    setChecking(true);
    try {
      const res = await fetch(
        `/api/quote?code=${encodeURIComponent(normalized)}`
      );
      const data = await res.json();
      if (!res.ok || !data.booking) {
        setError(
          data.error ||
            "We couldn’t find that code. Check the number and try again."
        );
        return;
      }
      router.push(`/quote/${encodeURIComponent(normalized)}`);
    } catch {
      setError("Network error — try again or call us.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
          <FileText size={28} />
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Check your quote
        </h1>
        <p className="mt-3 text-gray-400">
          Enter the confirmation code we sent you (starts with{" "}
          <span className="font-mono text-cyan-300">HL-</span>) to view status,
          accept a quote, or pick an appointment time.
        </p>
      </div>

      <form
        onSubmit={go}
        className="rounded-2xl border border-gray-800 bg-gray-950 p-5 sm:p-6"
      >
        <label
          htmlFor="quote-code"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Quote / confirmation code
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="quote-code"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="characters"
            placeholder="HL-A3K9"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-h-[48px] flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 font-mono text-lg tracking-wider text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <button
            type="submit"
            disabled={checking}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 font-bold text-black hover:bg-cyan-400 disabled:opacity-50"
          >
            <Search size={18} />
            {checking ? "Checking…" : "View status"}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <p className="mt-4 text-xs text-gray-500">
          Codes look like <span className="font-mono text-gray-400">HL-XXXX</span>
          . You’ll find yours in your text/email or on the confirmation screen
          after you submitted photos.
        </p>
      </form>

      <div className="mt-8 space-y-3 text-center text-sm text-gray-400">
        <p>
          Don’t have a code yet?{" "}
          <Link href="/book" className="font-medium text-cyan-400 hover:underline">
            Start with photos
          </Link>
        </p>
        <p>
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline"
          >
            <Phone size={14} />
            Call {PHONE}
          </a>
        </p>
      </div>
    </div>
  );
}
