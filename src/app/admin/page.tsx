"use client";

import { useState } from "react";
import { serviceLabel } from "@/lib/booking";

type Booking = {
  id: string;
  created_at: string;
  status: string;
  confirmation_code: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  service_type: string | null;
  preferred_date: string | null;
  preferred_window: string | null;
  vehicle_year: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  address: string | null;
  city: string | null;
  photo_count: number;
};

const STATUSES = [
  "new",
  "contacted",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const load = async (pwd: string) => {
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
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setBookings((rows) =>
        rows.map((b) => (b.id === id ? { ...b, status } : b))
      );
    }
  };

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4 py-16">
        <h1 className="mb-2 text-2xl font-bold text-white">Scheduler Admin</h1>
        <p className="mb-6 text-sm text-gray-400">
          Enter the admin password (set as{" "}
          <code className="text-cyan-400">ADMIN_PASSWORD</code> on Vercel).
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
          {loading ? "Loading…" : "Open bookings"}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Bookings</h1>
        <button
          type="button"
          onClick={() => load(password)}
          className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300"
        >
          Refresh
        </button>
      </div>
      {message && (
        <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {message}
        </p>
      )}
      {bookings.length === 0 ? (
        <p className="text-gray-400">No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-gray-800 bg-gray-900/80 p-4"
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-white">{b.full_name}</p>
                  <p className="text-sm text-cyan-400">{b.phone}</p>
                  {b.confirmation_code && (
                    <p className="font-mono text-xs text-gray-500">
                      {b.confirmation_code}
                    </p>
                  )}
                </div>
                <select
                  value={b.status}
                  onChange={(e) => updateStatus(b.id, e.target.value)}
                  className="rounded-lg border border-gray-700 bg-black px-2 py-1 text-sm text-white"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-400">
                {serviceLabel(b.service_type || "")} · {b.photo_count} photo
                {b.photo_count === 1 ? "" : "s"}
              </p>
              <p className="text-sm text-gray-400">
                {b.vehicle_year} {b.vehicle_make} {b.vehicle_model}
              </p>
              <p className="text-sm text-gray-400">
                {b.address}, {b.city}
              </p>
              <p className="text-sm text-gray-400">
                {b.preferred_date} · {b.preferred_window}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                {new Date(b.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
