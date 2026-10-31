"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ADMIN_SECTIONS,
  SERVICE_TYPES,
  boardSection,
  formatMoney,
  isQuoteLost,
  serviceLabel,
  statusLabel,
  TIME_WINDOWS,
  type BoardSectionId,
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
  quoted_at: string | null;
  scheduled_date: string | null;
  scheduled_window: string | null;
  notes: string | null;
  is_insurance?: boolean;
  claim_number?: string | null;
};

const TAB_STYLE: Record<
  string,
  { active: string; idle: string; badge: string }
> = {
  pending: {
    active: "border-amber-400 bg-amber-500/20 text-amber-100",
    idle: "border-gray-800 bg-gray-900 text-gray-400",
    badge: "bg-amber-400 text-black",
  },
  quoted: {
    active: "border-cyan-400 bg-cyan-500/20 text-cyan-100",
    idle: "border-gray-800 bg-gray-900 text-gray-400",
    badge: "bg-cyan-500 text-black",
  },
  accepted: {
    active: "border-emerald-400 bg-emerald-500/20 text-emerald-100",
    idle: "border-gray-800 bg-gray-900 text-gray-400",
    badge: "bg-emerald-500 text-black",
  },
  scheduled: {
    active: "border-blue-400 bg-blue-500/20 text-blue-100",
    idle: "border-gray-800 bg-gray-900 text-gray-400",
    badge: "bg-blue-500 text-black",
  },
  repaired: {
    active: "border-violet-400 bg-violet-500/20 text-violet-100",
    idle: "border-gray-800 bg-gray-900 text-gray-400",
    badge: "bg-violet-500 text-black",
  },
  not_accepted: {
    active: "border-rose-400 bg-rose-500/20 text-rose-100",
    idle: "border-gray-800 bg-gray-900 text-gray-400",
    badge: "bg-rose-500 text-black",
  },
  archive: {
    active: "border-gray-500 bg-gray-700/40 text-gray-200",
    idle: "border-gray-800 bg-gray-900 text-gray-500",
    badge: "bg-gray-600 text-gray-200",
  },
  all: {
    active: "border-white/40 bg-white/10 text-white",
    idle: "border-gray-800 bg-gray-900 text-gray-400",
    badge: "bg-gray-600 text-white",
  },
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [section, setSection] = useState<BoardSectionId>("pending");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: string; url: string }[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [quoteDollars, setQuoteDollars] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [slotDate, setSlotDate] = useState("");
  const [slotWindow, setSlotWindow] = useState(TIME_WINDOWS[0]);
  const [slotMsg, setSlotMsg] = useState("");

  // Filters
  const [q, setQ] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterInsurance, setFilterInsurance] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterHasPhotos, setFilterHasPhotos] = useState("");
  const [filterAmount, setFilterAmount] = useState("");
  const [filterSort, setFilterSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

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
    const c: Record<BoardSectionId, number> = {
      pending: 0,
      quoted: 0,
      accepted: 0,
      scheduled: 0,
      repaired: 0,
      not_accepted: 0,
      archive: 0,
      all: bookings.length,
    };
    for (const b of bookings) {
      const sec = boardSection(b);
      if (sec !== "all") c[sec]++;
    }
    return c;
  }, [bookings]);

  const cities = useMemo(() => {
    const set = new Set<string>();
    for (const b of bookings) {
      if (b.city?.trim()) set.add(b.city.trim());
    }
    return Array.from(set).sort();
  }, [bookings]);

  const filtered = useMemo(() => {
    let list = bookings.filter((b) => {
      if (section !== "all" && boardSection(b) !== section) return false;

      if (q.trim()) {
        const hay = [
          b.full_name,
          b.phone,
          b.email,
          b.confirmation_code,
          b.vehicle_make,
          b.vehicle_model,
          b.vehicle_year,
          b.city,
          b.claim_number,
          b.notes,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q.trim().toLowerCase())) return false;
      }

      if (filterService && b.service_type !== filterService) return false;

      if (filterInsurance === "yes" && !b.is_insurance) return false;
      if (filterInsurance === "no" && b.is_insurance) return false;

      if (filterCity && (b.city || "").trim() !== filterCity) return false;

      if (filterHasPhotos === "yes" && !(b.photo_count > 0)) return false;
      if (filterHasPhotos === "no" && b.photo_count > 0) return false;

      const cents = b.quote_amount_cents;
      if (filterAmount === "none" && cents != null) return false;
      if (filterAmount === "under500" && !(cents != null && cents < 50000))
        return false;
      if (
        filterAmount === "500to1500" &&
        !(cents != null && cents >= 50000 && cents <= 150000)
      )
        return false;
      if (filterAmount === "over1500" && !(cents != null && cents > 150000))
        return false;

      return true;
    });

    list = [...list].sort((a, b) => {
      if (filterSort === "oldest")
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (filterSort === "amount_high")
        return (b.quote_amount_cents || 0) - (a.quote_amount_cents || 0);
      if (filterSort === "amount_low")
        return (a.quote_amount_cents || 0) - (b.quote_amount_cents || 0);
      if (filterSort === "name")
        return (a.full_name || "").localeCompare(b.full_name || "");
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return list;
  }, [
    bookings,
    section,
    q,
    filterService,
    filterInsurance,
    filterCity,
    filterHasPhotos,
    filterAmount,
    filterSort,
  ]);

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
    const raw = String(quoteDollars).replace(/[$,\s]/g, "").trim();
    const dollars = parseFloat(raw);
    if (!Number.isFinite(dollars) || dollars <= 0) {
      setError("Enter a valid quote amount greater than $0");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
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
      setMessage(
        data.message ||
          (data.quoteUrl
            ? `Quote saved. Link: ${data.quoteUrl}`
            : "Quote saved.")
      );
      await load(password);
      setSection("quoted");
      setExpanded(null);
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (id: string, status: string) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Status update failed");
        return;
      }
      await load(password);
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
      body: JSON.stringify({ date: slotDate, window: slotWindow }),
    });
    const data = await res.json();
    setSlotMsg(res.ok ? "Slot opened for customers." : data.error || "Failed");
  };

  useEffect(() => {
    if (!authed || !password) return;
    const t = setInterval(() => load(password), 45000);
    return () => clearInterval(t);
  }, [authed, password, load]);

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="mb-2 text-2xl font-bold text-white">Admin</h1>
        <p className="mb-4 text-sm text-gray-400">
          Quote board + CRM — enter admin password
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
          className="w-full rounded-xl bg-cyan-500 py-3 font-bold text-black disabled:opacity-40"
        >
          {loading ? "Loading…" : "Open board"}
        </button>
      </div>
    );
  }

  const sectionMeta = ADMIN_SECTIONS.find((s) => s.id === section);

  return (
    <div className="mx-auto max-w-5xl px-3 pb-16 pt-4 sm:px-4 sm:pt-8">
      <div className="sticky top-14 z-30 -mx-3 mb-4 border-b border-cyan-500/20 bg-black/95 px-3 py-3 backdrop-blur sm:-mx-4 sm:px-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-white sm:text-xl">Job board</h1>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/customers"
              className="rounded-lg border border-cyan-500/40 px-3 py-1.5 text-xs font-medium text-cyan-300"
            >
              Customers
            </Link>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className="rounded-lg border border-gray-600 px-3 py-1.5 text-xs text-gray-200"
            >
              {showFilters ? "Hide filters" : "Filters"}
            </button>
            <button
              type="button"
              onClick={() => load(password)}
              className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Status tabs — scroll on mobile */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {ADMIN_SECTIONS.map((tab) => {
            const style = TAB_STYLE[tab.id] || TAB_STYLE.all;
            const count = counts[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSection(tab.id)}
                className={`min-w-[4.5rem] shrink-0 rounded-xl border px-2 py-2 text-center transition ${
                  section === tab.id ? style.active : style.idle
                }`}
              >
                <span
                  className={`mb-0.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${style.badge}`}
                >
                  {count}
                </span>
                <span className="block text-[10px] font-semibold sm:text-xs">
                  {tab.short}
                </span>
              </button>
            );
          })}
        </div>

        {counts.pending > 0 && section !== "pending" && (
          <p className="mt-2 text-center text-xs text-amber-300">
            {counts.pending} pending quote
            {counts.pending === 1 ? "" : "s"}
          </p>
        )}
        {counts.archive > 0 && section !== "archive" && (
          <p className="mt-1 text-center text-xs text-gray-500">
            {counts.archive} lost/archive (quoted 30+ days, no accept)
          </p>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-4 space-y-3 rounded-2xl border border-gray-800 bg-gray-950 p-3">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, HL-code, vehicle, city…"
            className="w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white"
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-900 px-2 py-2 text-xs text-white"
            >
              <option value="">All services</option>
              {SERVICE_TYPES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={filterInsurance}
              onChange={(e) => setFilterInsurance(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-900 px-2 py-2 text-xs text-white"
            >
              <option value="">Insurance: any</option>
              <option value="yes">Insurance yes</option>
              <option value="no">Customer-pay</option>
            </select>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-900 px-2 py-2 text-xs text-white"
            >
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={filterHasPhotos}
              onChange={(e) => setFilterHasPhotos(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-900 px-2 py-2 text-xs text-white"
            >
              <option value="">Photos: any</option>
              <option value="yes">Has photos</option>
              <option value="no">No photos</option>
            </select>
            <select
              value={filterAmount}
              onChange={(e) => setFilterAmount(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-900 px-2 py-2 text-xs text-white"
            >
              <option value="">Amount: any</option>
              <option value="none">No quote yet</option>
              <option value="under500">Under $500</option>
              <option value="500to1500">$500–$1,500</option>
              <option value="over1500">Over $1,500</option>
            </select>
            <select
              value={filterSort}
              onChange={(e) => setFilterSort(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-900 px-2 py-2 text-xs text-white"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="amount_high">Quote $ high</option>
              <option value="amount_low">Quote $ low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setFilterService("");
              setFilterInsurance("");
              setFilterCity("");
              setFilterHasPhotos("");
              setFilterAmount("");
              setFilterSort("newest");
            }}
            className="text-xs text-cyan-400 underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {message && (
        <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {message}
        </p>
      )}
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <p className="mb-3 text-sm text-gray-500">
        {sectionMeta?.description} · showing {filtered.length}
        {filtered.length !== bookings.length
          ? ` of ${bookings.length}`
          : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-gray-800 bg-gray-900/50 px-4 py-10 text-center text-gray-500">
          Nothing matches this section / filters.
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
                    {isQuoteLost(b) ? " · 30d+ lost" : ""}
                    {b.is_insurance ? " · Insurance" : ""}
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
                <div className="border-t border-gray-800 bg-black/40 p-4 space-y-4">
                  {/* Job detail grid */}
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    <div className="rounded-xl border border-gray-800 bg-gray-950/80 p-3 space-y-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Customer
                      </p>
                      <p className="font-medium text-white">{b.full_name}</p>
                      <p>
                        <a href={`tel:${b.phone}`} className="text-cyan-400 hover:underline">
                          {b.phone}
                        </a>
                      </p>
                      {b.email && (
                        <p>
                          <a
                            href={`mailto:${b.email}`}
                            className="text-gray-300 hover:underline break-all"
                          >
                            {b.email}
                          </a>
                        </p>
                      )}
                      {(b.address || b.city) && (
                        <p className="text-gray-400 text-xs">
                          {[b.address, b.city].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="rounded-xl border border-gray-800 bg-gray-950/80 p-3 space-y-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Vehicle & job
                      </p>
                      <p className="text-white">
                        {[b.vehicle_year, b.vehicle_make, b.vehicle_model]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </p>
                      <p className="text-gray-400">
                        {serviceLabel(b.service_type || "")}
                      </p>
                      <p className="text-gray-400">
                        Status:{" "}
                        <span className="text-white">{statusLabel(b.status)}</span>
                        {isQuoteLost(b) && (
                          <span className="text-amber-400"> · 30d+ no accept</span>
                        )}
                      </p>
                      {b.is_insurance && (
                        <p className="text-amber-200/90 text-xs">
                          Insurance job
                          {b.claim_number ? ` · Claim ${b.claim_number}` : ""}
                        </p>
                      )}
                      {b.confirmation_code && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="font-mono text-xs text-cyan-300">
                            {b.confirmation_code}
                          </span>
                          <button
                            type="button"
                            className="rounded border border-gray-600 px-2 py-0.5 text-[10px] text-gray-300 hover:border-cyan-500"
                            onClick={() => {
                              const site =
                                typeof window !== "undefined"
                                  ? window.location.origin
                                  : "";
                              const url = `${site}/quote/${b.confirmation_code}`;
                              navigator.clipboard?.writeText(url);
                              setMessage(`Copied: ${url}`);
                            }}
                          >
                            Copy quote link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {(b.quote_amount_cents != null || b.quote_notes) && (
                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-sm">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-400/80">
                        Quote
                      </p>
                      {b.quote_amount_cents != null && (
                        <p className="text-xl font-bold text-cyan-300">
                          {formatMoney(b.quote_amount_cents)}
                        </p>
                      )}
                      {b.quoted_at && (
                        <p className="text-xs text-gray-500">
                          Sent {new Date(b.quoted_at).toLocaleString()}
                        </p>
                      )}
                      {b.quote_notes && (
                        <p className="mt-1 text-gray-300">{b.quote_notes}</p>
                      )}
                    </div>
                  )}

                  {b.scheduled_date && (
                    <p className="text-sm text-emerald-300">
                      Appointment:{" "}
                      {new Date(b.scheduled_date + "T12:00:00").toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}{" "}
                      · {b.scheduled_window}
                    </p>
                  )}

                  {b.notes && (
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">Customer notes:</span> {b.notes}
                    </p>
                  )}

                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                      Customer photos (staff only)
                    </p>
                    {photosLoading ? (
                      <p className="text-sm text-gray-500">Loading photos…</p>
                    ) : photos.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No photos stored for this job.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                  </div>

                  {["quote_requested", "new", "quoted"].includes(b.status) && (
                    <div className="space-y-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
                      <p className="text-sm font-medium text-cyan-200">
                        {b.status === "quoted" ? "Update / resend quote" : "Send quote"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="450.00"
                            value={quoteDollars}
                            onChange={(e) => setQuoteDollars(e.target.value)}
                            className="w-36 rounded-lg border border-gray-700 bg-gray-900 py-2 pl-7 pr-3 text-white"
                          />
                        </div>
                        <input
                          placeholder="Notes to customer (optional)"
                          value={quoteNotes}
                          onChange={(e) => setQuoteNotes(e.target.value)}
                          className="min-w-[12rem] flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => sendQuote(b.id)}
                        className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-bold text-black disabled:opacity-40"
                      >
                        {saving
                          ? "Saving…"
                          : b.status === "quoted"
                            ? "Update quote & notify"
                            : "Send quote & notify"}
                      </button>
                      <p className="text-[11px] text-gray-500">
                        Saves the amount, sets status to Quoted, and texts/emails the
                        customer when Twilio/Resend are configured.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {["scheduled", "in_progress", "quote_approved"].includes(
                      b.status
                    ) && (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => setStatus(b.id, "completed")}
                        className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Mark repaired
                      </button>
                    )}
                    {b.status === "quoted" && (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => setStatus(b.id, "declined")}
                        className="rounded-lg border border-rose-500/50 px-3 py-1.5 text-xs text-rose-300"
                      >
                        Mark not accepted
                      </button>
                    )}
                    {["quote_requested", "quoted", "quote_approved"].includes(
                      b.status
                    ) && (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => setStatus(b.id, "cancelled")}
                        className="rounded-lg border border-gray-600 px-3 py-1.5 text-xs text-gray-400"
                      >
                        Cancel job
                      </button>
                    )}
                    {(isQuoteLost(b) || b.status === "declined") && (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => setStatus(b.id, "quoted")}
                        className="rounded-lg border border-cyan-500/40 px-3 py-1.5 text-xs text-cyan-300"
                      >
                        Re-open as quoted
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Open availability */}
      <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-950 p-4">
        <h2 className="mb-2 font-semibold text-white">Open a time slot</h2>
        <p className="mb-3 text-xs text-gray-500">
          Extra slots beyond the seeded Mon–Sat windows
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            value={slotDate}
            onChange={(e) => setSlotDate(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
          />
          <select
            value={slotWindow}
            onChange={(e) => setSlotWindow(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
          >
            {TIME_WINDOWS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addSlot}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-black"
          >
            Open slot
          </button>
        </div>
        {slotMsg && (
          <p className="mt-2 text-sm text-gray-400">{slotMsg}</p>
        )}
      </div>
    </div>
  );
}
