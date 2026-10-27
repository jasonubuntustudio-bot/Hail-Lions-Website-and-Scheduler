"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ADMIN_SECTIONS,
  formatMoney,
  serviceLabel,
  statusLabel,
  TIME_WINDOWS,
} from "@/lib/booking";

type Booking = {
  id: string;
  created_at: string;
  status: string;
  confirmation_code: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  service_type: string | null;
  vehicle_year: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  address: string | null;
  city: string | null;
  photo_count: number;
  quote_amount_cents: number | null;
  quote_notes: string | null;
  scheduled_date: string | null;
  scheduled_window: string | null;
  notes: string | null;
};

type SectionId = "pending" | "quoted" | "accepted" | "other";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [section, setSection] = useState<SectionId>("pending");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: string; url: string }[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [quoteDollars, setQuoteDollars] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [slotDate, setSlotDate] = useState("");
  const [slotWindow, setSlotWindow] = useState(TIME_WINDOWS[0]);
  const [slotMsg, setSlotMsg] = useState("");

  const load = useCallback(async (pwd: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/bookings", {
        headers: { "x-admin-password": pwd },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setAuthed(false);
        return;
      }
      setAuthed(true);
      setBookings(data.bookings || []);
      setMessage(data.message || "");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  const counts = useMemo(() => {
    const c = { pending: 0, quoted: 0, accepted: 0, other: 0 };
    for (const b of bookings) {
      if (["quote_requested", "new"].includes(b.status)) c.pending++;
      else if (b.status === "quoted") c.quoted++;
      else if (["quote_approved", "scheduled"].includes(b.status)) c.accepted++;
      else c.other++;
    }
    return c;
  }, [bookings]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (section === "pending")
        return ["quote_requested", "new"].includes(b.status);
      if (section === "quoted") return b.status === "quoted";
      if (section === "accepted")
        return ["quote_approved", "scheduled"].includes(b.status);
      return !["quote_requested", "new", "quoted", "quote_approved", "scheduled"].includes(
        b.status
      );
    });
  }, [bookings, section]);

  const loadPhotos = async (bookingId: string) => {
    setPhotosLoading(true);
    setPhotos([]);
    try {
      const res = await fetch(
        `/api/admin/photos?bookingId=${encodeURIComponent(bookingId)}`,
        { headers: { "x-admin-password": password } }
      );
      const data = await res.json();
      if (res.ok) setPhotos(data.photos || []);
    } finally {
      setPhotosLoading(false);
    }
  };

  const openCard = (b: Booking) => {
    if (expanded === b.id) {
      setExpanded(null);
      setPhotos([]);
      return;
    }
    setExpanded(b.id);
    setQuoteDollars(
      b.quote_amount_cents != null
        ? (b.quote_amount_cents / 100).toFixed(2)
        : ""
    );
    setQuoteNotes(b.quote_notes || "");
    loadPhotos(b.id);
  };

  const sendQuote = async (id: string) => {
    const dollars = Number(quoteDollars);
    if (!dollars || dollars <= 0) {
      setError("Enter a quote amount");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          id,
          sendQuote: true,
          quoteAmountDollars: dollars,
          quoteNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send quote");
        return;
      }
      await load(password);
      setSection("quoted");
    } finally {
      setSaving(false);
    }
  };

  const addSlot = async () => {
    if (!slotDate || !slotWindow) return;
    setSlotMsg("");
    const res = await fetch("/api/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ date: slotDate, window: slotWindow, isOpen: true }),
    });
    const data = await res.json();
    setSlotMsg(res.ok ? "Slot opened for customers." : data.error || "Failed");
  };

  // Poll for new pending while on admin (alert feel)
  useEffect(() => {
    if (!authed) return;
    const t = setInterval(() => load(password), 45000);
    return () => clearInterval(t);
  }, [authed, password, load]);

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4 py-16">
        <h1 className="mb-2 text-2xl font-bold text-white">Admin</h1>
        <p className="mb-6 text-sm text-gray-400">
          Quote board — photos private to staff only.
        </p>
        <input
          type="password"
          className="mb-3 w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(password)}
        />
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
        <button
          type="button"
          disabled={loading || !password}
          onClick={() => load(password)}
          className="rounded-xl bg-cyan-500 py-3 font-bold text-black disabled:opacity-40"
        >
          {loading ? "Loading…" : "Open board"}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-3 pb-16 pt-4 sm:px-4 sm:pt-8">
      {/* ADMIN STATUS BAR */}
      <div className="sticky top-14 z-30 -mx-3 mb-6 border-b border-cyan-500/20 bg-black/95 px-3 py-3 backdrop-blur sm:-mx-4 sm:px-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-white sm:text-xl">
            Quote board
          </h1>
          <div className="flex gap-2">
            <Link
              href="/admin/customers"
              className="rounded-lg border border-cyan-500/40 px-3 py-1.5 text-xs font-medium text-cyan-300"
            >
              Customers
            </Link>
            <button
              type="button"
              onClick={() => load(password)}
              className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300"
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              {
                id: "pending" as const,
                label: "Pending",
                count: counts.pending,
                active: "border-amber-400 bg-amber-500/20 text-amber-200",
                idle: "border-gray-800 bg-gray-900 text-gray-400",
                badge: counts.pending > 0 ? "bg-amber-400 text-black" : "bg-gray-700 text-gray-300",
              },
              {
                id: "quoted" as const,
                label: "Quoted",
                count: counts.quoted,
                active: "border-cyan-400 bg-cyan-500/20 text-cyan-200",
                idle: "border-gray-800 bg-gray-900 text-gray-400",
                badge: "bg-cyan-500/80 text-black",
              },
              {
                id: "accepted" as const,
                label: "Accepted",
                count: counts.accepted,
                active: "border-emerald-400 bg-emerald-500/20 text-emerald-200",
                idle: "border-gray-800 bg-gray-900 text-gray-400",
                badge: "bg-emerald-500/80 text-black",
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSection(tab.id)}
              className={`rounded-xl border px-2 py-2.5 text-center transition ${
                section === tab.id ? tab.active : tab.idle
              }`}
            >
              <span
                className={`mb-1 inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-1.5 text-xs font-bold ${tab.badge}`}
              >
                {tab.count}
              </span>
              <span className="block text-xs font-semibold sm:text-sm">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        {counts.pending > 0 && section !== "pending" && (
          <p className="mt-2 text-center text-xs text-amber-300">
            {counts.pending} new request{counts.pending === 1 ? "" : "s"} waiting
            for a quote
          </p>
        )}
      </div>

      {message && (
        <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 text-sm text-red-400">{error}</p>
      )}

      <p className="mb-3 text-sm text-gray-500">
        {ADMIN_SECTIONS.find((s) => s.id === section)?.description ||
          "Other statuses"}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-gray-800 bg-gray-900/50 px-4 py-10 text-center text-gray-500">
          Nothing in this section yet.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/80"
            >
              <button
                type="button"
                onClick={() => openCard(b)}
                className="flex w-full items-start justify-between gap-3 p-4 text-left"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-white">{b.full_name}</p>
                  <p className="text-sm text-cyan-400">{b.phone}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {serviceLabel(b.service_type || "")} · {b.photo_count} photo
                    {b.photo_count === 1 ? "" : "s"} · {statusLabel(b.status)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {b.vehicle_year} {b.vehicle_make} {b.vehicle_model}
                    {b.city ? ` · ${b.city}` : ""}
                  </p>
                  {b.confirmation_code && (
                    <p className="font-mono text-xs text-gray-600">
                      {b.confirmation_code}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  {b.quote_amount_cents != null && (
                    <p className="font-semibold text-cyan-300">
                      {formatMoney(b.quote_amount_cents)}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-600">
                    {new Date(b.created_at).toLocaleString()}
                  </p>
                </div>
              </button>

              {expanded === b.id && (
                <div className="border-t border-gray-800 bg-black/40 p-4">
                  {/* Private photos — admin only */}
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Customer photos (staff only)
                  </p>
                  {photosLoading ? (
                    <p className="text-sm text-gray-500">Loading photos…</p>
                  ) : photos.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No photos stored (or demo mode).
                    </p>
                  ) : (
                    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {photos.map((p) => (
                        <a
                          key={p.id}
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="relative aspect-square overflow-hidden rounded-lg border border-gray-700"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.url}
                            alt="Customer damage photo"
                            className="h-full w-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  {b.notes && (
                    <p className="mb-3 text-sm text-gray-400">
                      Notes: {b.notes}
                    </p>
                  )}

                  {/* Send quote — pending section */}
                  {["quote_requested", "new", "quoted"].includes(b.status) && (
                    <div className="mb-3 space-y-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                      <p className="text-sm font-medium text-cyan-300">
                        Send quote to customer
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="Amount $"
                          value={quoteDollars}
                          onChange={(e) => setQuoteDollars(e.target.value)}
                          className="w-32 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
                        />
                        <input
                          placeholder="Quote notes (optional)"
                          value={quoteNotes}
                          onChange={(e) => setQuoteNotes(e.target.value)}
                          className="min-w-[12rem] flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => sendQuote(b.id)}
                        className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-black disabled:opacity-40"
                      >
                        {saving ? "Sending…" : "Send quote + alert customer"}
                      </button>
                    </div>
                  )}

                  {b.scheduled_date && (
                    <p className="text-sm text-emerald-300">
                      Scheduled:{" "}
                      {b.scheduled_date
                        ? new Date(
                            b.scheduled_date + "T12:00:00"
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                      {b.scheduled_window ? ` · ${b.scheduled_window}` : ""}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Open availability for accepted customers */}
      <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-950 p-4">
        <h2 className="mb-2 font-semibold text-white">Open time slots</h2>
        <p className="mb-3 text-xs text-gray-500">
          Calendar date + clock times. Mon–Fri: 8:00 AM, 11:00 AM, 3:00 PM ·
          Sat: 8:00 AM, 11:00 AM · Sun closed. Customers only see open slots
          after they accept a quote. Prefer the seed SQL for bulk weeks.
        </p>
        <div className="flex flex-wrap items-end gap-2">
          <label className="block text-xs text-gray-500">
            Date
            <input
              type="date"
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
              className="mt-1 block rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
            />
          </label>
          <label className="block text-xs text-gray-500">
            Time
            <select
              value={slotWindow}
              onChange={(e) => setSlotWindow(e.target.value)}
              className="mt-1 block rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 font-medium tabular-nums text-white"
            >
              {TIME_WINDOWS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={addSlot}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-black"
          >
            Open slot
          </button>
        </div>
        {slotMsg && (
          <p className="mt-2 text-sm text-cyan-300">{slotMsg}</p>
        )}
      </div>
    </div>
  );
}
