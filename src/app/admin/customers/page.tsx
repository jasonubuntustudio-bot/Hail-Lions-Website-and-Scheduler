"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { displayPhone, INTERACTION_CHANNELS } from "@/lib/crm";
import { formatMoney, serviceLabel, statusLabel } from "@/lib/booking";

type Customer = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  notes: string | null;
  tags: string[] | null;
  last_contact_at: string | null;
  next_follow_up_at: string | null;
  updated_at: string;
};

type Interaction = {
  id: string;
  channel: string;
  direction: string;
  subject: string | null;
  body: string | null;
  created_at: string;
};

type BookingRow = {
  id: string;
  confirmation_code: string | null;
  status: string;
  created_at: string;
  service_type: string | null;
  quote_amount_cents: number | null;
  scheduled_date: string | null;
  photo_count: number;
};

export default function AdminCustomersPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [q, setQ] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<{
    customer: Customer;
    interactions: Interaction[];
    bookings: BookingRow[];
  } | null>(null);
  const [error, setError] = useState("");
  const [noteChannel, setNoteChannel] = useState("note");
  const [noteBody, setNoteBody] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [crmNotes, setCrmNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const headers = () => ({ "x-admin-password": password });

  const login = async () => {
    setError("");
    const res = await fetch("/api/admin/customers", { headers: headers() });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Unauthorized");
      return;
    }
    setAuthed(true);
    setCustomers(data.customers || []);
  };

  const search = useCallback(async () => {
    const res = await fetch(
      `/api/admin/customers?q=${encodeURIComponent(q)}`,
      { headers: headers() }
    );
    const data = await res.json();
    if (res.ok) setCustomers(data.customers || []);
  }, [q, password]);

  const openCustomer = async (id: string) => {
    setSelected(id);
    const res = await fetch(`/api/admin/customers?id=${id}`, {
      headers: headers(),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Load failed");
      return;
    }
    setDetail(data);
    setCrmNotes(data.customer.notes || "");
    setFollowUp(data.customer.next_follow_up_at || "");
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    await fetch("/api/admin/customers", {
      method: "PATCH",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selected,
        notes: crmNotes,
        next_follow_up_at: followUp || null,
      }),
    });
    setSaving(false);
    await openCustomer(selected);
  };

  const addInteraction = async () => {
    if (!selected || !noteBody.trim()) return;
    setSaving(true);
    await fetch("/api/admin/customers", {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "interaction",
        customerId: selected,
        channel: noteChannel,
        direction: "outbound",
        subject: noteChannel,
        body: noteBody.trim(),
      }),
    });
    setNoteBody("");
    setSaving(false);
    await openCustomer(selected);
  };

  useEffect(() => {
    if (authed) search();
  }, [authed]); // eslint-disable-line

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-sm flex-col justify-center px-4 py-16">
        <h1 className="mb-2 text-2xl font-bold text-white">Customers</h1>
        <p className="mb-4 text-sm text-gray-400">CRM — same admin password</p>
        <input
          type="password"
          className="mb-3 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          placeholder="Admin password"
        />
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
        <button
          type="button"
          onClick={login}
          className="rounded-xl bg-cyan-500 py-3 font-bold text-black"
        >
          Open CRM
        </button>
        <Link href="/admin" className="mt-4 text-center text-sm text-cyan-400">
          ← Quote board
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-3 py-6 sm:px-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Customers</h1>
          <p className="text-xs text-gray-500">
            Retain & communicate — history stays with the phone number
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link
            href="/admin"
            className="rounded-lg border border-gray-700 px-3 py-2 text-gray-300"
          >
            Quote board
          </Link>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Search name, phone, city…"
          className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-white"
        />
        <button
          type="button"
          onClick={search}
          className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-black"
        >
          Search
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* List */}
        <div className="max-h-[70vh] space-y-2 overflow-y-auto">
          {customers.length === 0 ? (
            <p className="text-sm text-gray-500">
              No customers yet. They appear when someone submits a quote
              request.
            </p>
          ) : (
            customers.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => openCustomer(c.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selected === c.id
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-gray-800 bg-gray-900/80 hover:border-gray-600"
                }`}
              >
                <p className="font-semibold text-white">{c.full_name}</p>
                <p className="text-sm text-cyan-400">{displayPhone(c.phone)}</p>
                <p className="text-xs text-gray-500">
                  {c.city || "—"}
                  {c.next_follow_up_at
                    ? ` · Follow-up ${c.next_follow_up_at}`
                    : ""}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
          {!detail ? (
            <p className="py-10 text-center text-sm text-gray-500">
              Select a customer
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {detail.customer.full_name}
                </h2>
                <a
                  href={`tel:${detail.customer.phone}`}
                  className="text-cyan-400"
                >
                  {displayPhone(detail.customer.phone)}
                </a>
                {detail.customer.email && (
                  <p className="text-sm text-gray-400">{detail.customer.email}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  CRM notes
                </label>
                <textarea
                  value={crmNotes}
                  onChange={(e) => setCrmNotes(e.target.value)}
                  className="min-h-[72px] w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white"
                />
                <label className="mb-1 mt-2 block text-xs text-gray-500">
                  Next follow-up
                </label>
                <input
                  type="date"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
                />
                <button
                  type="button"
                  disabled={saving}
                  onClick={saveNotes}
                  className="ml-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-bold text-black"
                >
                  Save
                </button>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase text-gray-500">
                  Log communication
                </p>
                <div className="mb-2 flex flex-wrap gap-2">
                  <select
                    value={noteChannel}
                    onChange={(e) => setNoteChannel(e.target.value)}
                    className="rounded-lg border border-gray-700 bg-gray-900 px-2 py-2 text-sm text-white"
                  >
                    {INTERACTION_CHANNELS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  placeholder="What did you discuss? Outcome?"
                  className="mb-2 min-h-[64px] w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white"
                />
                <button
                  type="button"
                  disabled={saving || !noteBody.trim()}
                  onClick={addInteraction}
                  className="rounded-lg border border-cyan-500/50 px-3 py-2 text-sm text-cyan-300"
                >
                  Add to timeline
                </button>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase text-gray-500">
                  Jobs / quotes
                </p>
                {detail.bookings.length === 0 ? (
                  <p className="text-sm text-gray-600">No linked jobs</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {detail.bookings.map((b) => (
                      <li
                        key={b.id}
                        className="rounded-lg border border-gray-800 px-3 py-2 text-gray-300"
                      >
                        {b.confirmation_code} · {statusLabel(b.status)} ·{" "}
                        {serviceLabel(b.service_type || "")}
                        {b.quote_amount_cents != null &&
                          ` · ${formatMoney(b.quote_amount_cents)}`}
                        {b.scheduled_date && ` · ${b.scheduled_date}`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase text-gray-500">
                  Communication history
                </p>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {detail.interactions.length === 0 ? (
                    <p className="text-sm text-gray-600">No history yet</p>
                  ) : (
                    detail.interactions.map((i) => (
                      <div
                        key={i.id}
                        className="rounded-lg border border-gray-800 bg-black/40 px-3 py-2 text-sm"
                      >
                        <p className="text-xs text-gray-500">
                          {new Date(i.created_at).toLocaleString()} ·{" "}
                          {i.channel} · {i.direction}
                        </p>
                        {i.subject && (
                          <p className="font-medium text-gray-200">{i.subject}</p>
                        )}
                        {i.body && (
                          <p className="text-gray-400">{i.body}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
