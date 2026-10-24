"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  formatMoney,
  serviceLabel,
  statusLabel,
} from "@/lib/booking";
import { PHONE, PHONE_TEL } from "@/lib/utils";
import { Check, Calendar } from "lucide-react";

type Booking = {
  confirmationCode: string;
  status: string;
  fullName: string;
  phone: string;
  serviceType: string | null;
  vehicleYear: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  quoteAmountCents: number | null;
  quoteNotes: string | null;
  scheduledDate: string | null;
  scheduledWindow: string | null;
};

type Slot = { date: string; window: string };

export default function QuoteStatusPage() {
  const params = useParams();
  const code = String(params.code || "").toUpperCase();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [picked, setPicked] = useState<Slot | null>(null);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/quote?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Not found");
        setBooking(null);
        return;
      }
      setBooking(data.booking);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [code]);

  const loadSlots = useCallback(async () => {
    const res = await fetch("/api/availability");
    const data = await res.json();
    if (res.ok) setSlots(data.slots || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (
      booking &&
      (booking.status === "quote_approved" || booking.status === "quoted")
    ) {
      // after approve we need slots; also preload when quoted so UI is ready
      if (booking.status === "quote_approved") loadSlots();
    }
  }, [booking, loadSlots]);

  // Poll for status updates (customer alert when quote arrives)
  useEffect(() => {
    const t = setInterval(async () => {
      const res = await fetch(`/api/quote?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!res.ok || !data.booking) return;
      setBooking((prev) => {
        if (prev && prev.status !== data.booking.status) {
          if (data.booking.status === "quoted") {
            setBanner("Your quote is ready — review and accept below.");
            if (typeof window !== "undefined" && "Notification" in window) {
              if (Notification.permission === "granted") {
                new Notification("Hail Lions", {
                  body: "Your quote is ready.",
                });
              }
            }
          }
          if (data.booking.status === "scheduled") {
            setBanner("You're scheduled — see details below.");
          }
        }
        return data.booking;
      });
    }, 20000);
    return () => clearInterval(t);
  }, [code]);

  const requestNotifyPermission = () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }
  };

  const act = async (action: "approve" | "decline" | "schedule") => {
    setBusy(true);
    setError("");
    try {
      const body: Record<string, string> = { code, action };
      if (action === "schedule" && picked) {
        body.date = picked.date;
        body.window = picked.window;
      }
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Action failed");
        return;
      }
      if (action === "approve") {
        setBanner("Quote accepted — pick a day and time.");
        await loadSlots();
      }
      if (action === "schedule") {
        setBanner("You're on the schedule.");
      }
      await load();
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-20 text-center text-gray-400">Loading…</div>
    );
  }

  if (error && !booking) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="mb-4 text-red-400">{error}</p>
        <Link href="/book" className="text-cyan-400">
          Request a quote
        </Link>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      {banner && (
        <div className="mb-4 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-4 py-3 text-sm text-cyan-100">
          {banner}
        </div>
      )}

      <h1 className="mb-1 text-2xl font-bold text-white">Your quote</h1>
      <p className="mb-6 font-mono text-sm text-cyan-400">
        {booking.confirmationCode}
      </p>

      <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/80 p-4 text-sm text-gray-300">
        <p>
          <span className="text-gray-500">Status:</span>{" "}
          <span className="font-medium text-white">
            {statusLabel(booking.status)}
          </span>
        </p>
        <p>
          <span className="text-gray-500">Vehicle:</span> {booking.vehicleYear}{" "}
          {booking.vehicleMake} {booking.vehicleModel}
        </p>
        <p>
          <span className="text-gray-500">Service:</span>{" "}
          {serviceLabel(booking.serviceType || "")}
        </p>
        {booking.quoteAmountCents != null && (
          <p className="mt-3 text-2xl font-bold text-cyan-300">
            {formatMoney(booking.quoteAmountCents)}
          </p>
        )}
        {booking.quoteNotes && (
          <p className="mt-2 text-gray-400">{booking.quoteNotes}</p>
        )}
        {booking.scheduledDate && (
          <p className="mt-3 flex items-center gap-2 text-emerald-300">
            <Calendar size={16} />
            {booking.scheduledDate} · {booking.scheduledWindow}
          </p>
        )}
      </div>

      {booking.status === "quote_requested" && (
        <p className="mb-4 text-gray-400">
          We&apos;re reviewing your photos. You&apos;ll get an alert here when
          the quote is ready.
        </p>
      )}

      {booking.status === "quoted" && (
        <div className="mb-6 space-y-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => act("approve")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 font-bold text-black"
          >
            <Check size={20} />
            Accept quote & choose time
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => act("decline")}
            className="w-full rounded-xl border border-gray-700 py-3 text-gray-400"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={requestNotifyPermission}
            className="w-full text-xs text-gray-500 underline"
          >
            Enable browser alerts for updates
          </button>
        </div>
      )}

      {booking.status === "quote_approved" && (
        <div className="mb-6">
          <h2 className="mb-3 font-semibold text-white">Pick an available time</h2>
          {slots.length === 0 ? (
            <p className="text-sm text-gray-500">
              No open slots yet — we&apos;ll open times soon. Call {PHONE} if
              urgent.
            </p>
          ) : (
            <div className="mb-4 max-h-64 space-y-2 overflow-y-auto">
              {slots.map((s) => {
                const key = `${s.date}|${s.window}`;
                const active =
                  picked &&
                  picked.date === s.date &&
                  picked.window === s.window;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPicked(s)}
                    className={`block w-full rounded-xl border px-4 py-3 text-left text-sm ${
                      active
                        ? "border-cyan-400 bg-cyan-500/15 text-cyan-200"
                        : "border-gray-700 bg-gray-900 text-gray-300"
                    }`}
                  >
                    {s.date} · {s.window}
                  </button>
                );
              })}
            </div>
          )}
          <button
            type="button"
            disabled={busy || !picked}
            onClick={() => act("schedule")}
            className="w-full rounded-xl bg-cyan-500 py-3.5 font-bold text-black disabled:opacity-40"
          >
            Confirm appointment
          </button>
        </div>
      )}

      {booking.status === "scheduled" && (
        <p className="mb-4 text-emerald-300">
          You&apos;re booked. We&apos;ll see you then.
        </p>
      )}

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      <a href={`tel:${PHONE_TEL}`} className="text-sm text-cyan-400">
        Call {PHONE}
      </a>
    </div>
  );
}
