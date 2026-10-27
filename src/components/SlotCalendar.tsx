"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Slot = { date: string; window: string };

function parseYmd(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** e.g. Monday, Oct 27, 2026 */
export function formatLongDate(ymd: string) {
  try {
    return parseYmd(ymd).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return ymd;
  }
}

/** e.g. 8:00 AM (already wall-clock labels) */
export function formatTimeLabel(window: string) {
  return window.trim();
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  slots: Slot[];
  picked: Slot | null;
  onPick: (slot: Slot) => void;
};

export function SlotCalendar({ slots, picked, onPick }: Props) {
  const slotsByDate = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of slots) {
      const list = map.get(s.date) || [];
      if (!list.includes(s.window)) list.push(s.window);
      map.set(s.date, list);
    }
    // Sort times: 8, 11, 3
    const order = ["8:00 AM", "11:00 AM", "3:00 PM"];
    for (const [k, list] of map) {
      map.set(
        k,
        [...list].sort((a, b) => {
          const ia = order.indexOf(a);
          const ib = order.indexOf(b);
          return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        })
      );
    }
    return map;
  }, [slots]);

  const availableDates = useMemo(
    () => [...slotsByDate.keys()].sort(),
    [slotsByDate]
  );

  const firstAvailable = availableDates[0] ? parseYmd(availableDates[0]) : new Date();
  const [view, setView] = useState(
    () => new Date(firstAvailable.getFullYear(), firstAvailable.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(
    picked?.date || availableDates[0] || null
  );

  const year = view.getFullYear();
  const month = view.getMonth();
  const monthLabel = view.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = new Date(year, month, 1).getDay();

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const timesForSelected = selectedDate
    ? slotsByDate.get(selectedDate) || []
    : [];

  const prevMonth = () => setView(new Date(year, month - 1, 1));
  const nextMonth = () => setView(new Date(year, month + 1, 1));

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-950">
      {/* Month header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-3 py-3">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-lg p-2 text-gray-300 hover:bg-gray-800"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <p className="font-semibold text-white">{monthLabel}</p>
        <button
          type="button"
          onClick={nextMonth}
          className="rounded-lg p-2 text-gray-300 hover:bg-gray-800"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 px-2 pt-2 text-center text-[11px] font-medium text-gray-500">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {cells.map((day, idx) => {
          if (day == null) {
            return <div key={`e-${idx}`} className="aspect-square" />;
          }
          const date = new Date(year, month, day);
          const ymd = toYmd(date);
          const hasSlots = slotsByDate.has(ymd);
          const isSelected = selectedDate === ymd;
          const isSunday = date.getDay() === 0;
          const isPast =
            ymd < toYmd(new Date()) || (isSunday && !hasSlots);

          return (
            <button
              key={ymd}
              type="button"
              disabled={!hasSlots}
              onClick={() => {
                setSelectedDate(ymd);
                // clear time until they pick one
              }}
              className={`aspect-square rounded-xl text-sm font-medium transition ${
                isSelected
                  ? "bg-cyan-500 text-black"
                  : hasSlots
                    ? "bg-gray-900 text-white hover:bg-gray-800 ring-1 ring-cyan-500/30"
                    : isPast || isSunday
                      ? "text-gray-700"
                      : "text-gray-600"
              } disabled:cursor-not-allowed`}
            >
              {day}
              {hasSlots && !isSelected && (
                <span className="mx-auto mt-0.5 block h-1 w-1 rounded-full bg-cyan-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Times for selected day */}
      <div className="border-t border-gray-800 px-3 py-3">
        {selectedDate ? (
          <>
            <p className="mb-2 text-sm text-gray-400">
              {formatLongDate(selectedDate)}
            </p>
            {timesForSelected.length === 0 ? (
              <p className="text-sm text-gray-500">No open times this day.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {timesForSelected.map((t) => {
                  const active =
                    picked?.date === selectedDate && picked?.window === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onPick({ date: selectedDate, window: t })}
                      className={`rounded-xl border px-2 py-3 text-center text-sm font-semibold tabular-nums ${
                        active
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                          : "border-gray-700 bg-gray-900 text-gray-200 hover:border-gray-500"
                      }`}
                    >
                      {formatTimeLabel(t)}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">Select a date on the calendar.</p>
        )}

        {picked && (
          <p className="mt-3 rounded-lg bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
            Selected:{" "}
            <span className="font-semibold">
              {formatLongDate(picked.date)} · {formatTimeLabel(picked.window)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
