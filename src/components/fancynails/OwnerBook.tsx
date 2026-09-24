"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BOOKABLE_SERVICES,
  CAPACITY,
  SALON,
  TRIAL,
  formatDuration,
  formatPrice,
  formatTime,
  findService,
} from "@/lib/fancynails/config";
import {
  addDays,
  dayOfMonth,
  formatDateLong,
  relativeDateLabel,
  todayISO,
  weekdayShort,
} from "@/lib/fancynails/dates";
import { Check, Field, inputCls, serif } from "./shared";

/* ══════════════════════════════════════════════════════════════════════════
   The front desk book — the screen the owner is actually being sold.

   Three things it has to prove, in this order:
     1. Everything is in ONE list, whichever way it came in.
     2. She can still write in it herself (phone, walk-in) — it isn't an
        online-only silo like the platform that already disappointed her.
     3. It prints. On paper. In the order she'd have written it.

   It polls every few seconds, so a booking made on a phone in the same room
   appears here on its own with a highlight. That moment is the pitch.
   ══════════════════════════════════════════════════════════════════════════ */

type BookingStatus = "booked" | "done" | "no-show" | "cancelled";
type BookingSource = "online" | "phone" | "walk-in";

type Booking = {
  id: string;
  date: string;
  start: string;
  minutes: number;
  serviceId: string;
  serviceName: string;
  price: number | null;
  name: string;
  phone: string;
  notes: string;
  status: BookingStatus;
  source: BookingSource;
  createdAt: string;
  seeded?: boolean;
};

const SOURCE_LABEL: Record<BookingSource, string> = {
  online: "Online",
  phone: "Phone",
  "walk-in": "Walk-in",
};

const SOURCE_STYLE: Record<BookingSource, string> = {
  online: "bg-[#eef3f0] text-[#3f6152] border-[#d5e5dc]",
  phone: "bg-[#f9eef0] text-[#8a5560] border-[#eed7db]",
  "walk-in": "bg-[#f6efe3] text-[#715c36] border-[#e9dcc3]",
};

const STATUS_STYLE: Record<BookingStatus, string> = {
  booked: "",
  done: "opacity-60",
  "no-show": "opacity-60",
  cancelled: "opacity-40",
};

const POLL_MS = 6000;

export function OwnerBook({ initialDate }: { initialDate: string }) {
  const [today] = useState(todayISO);
  const [date, setDate] = useState(initialDate);
  const [data, setData] = useState<{ date: string; bookings: Booking[] } | null>(
    null
  );
  const [weekCounts, setWeekCounts] = useState<Record<string, number>>({});
  const [storageMode, setStorageMode] = useState<"redis" | "memory" | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState("");
  const [justArrived, setJustArrived] = useState<Set<string>>(new Set());

  /* Every refresh — the poll, a status change, a hand-written booking — bumps
     this, which is what re-runs the fetch effects. Keeps all the state writes
     inside async callbacks rather than effect bodies. */
  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((t) => t + 1), []);

  // Which rows we'd already seen, so only genuinely new ones get highlighted.
  const seen = useRef<{ date: string; ids: Set<string> } | null>(null);

  const weekStart = useMemo(() => addDays(date, -3), [date]);

  // `data` belongs to whichever date it was fetched for; anything else is stale.
  const bookings = data?.date === date ? data.bookings : null;

  const flagArrivals = useCallback((target: string, next: Booking[]) => {
    const ids = new Set(next.map((b) => b.id));
    const previous = seen.current;
    seen.current = { date: target, ids };
    if (!previous || previous.date !== target) return;

    const fresh = next.filter((b) => !previous.ids.has(b.id)).map((b) => b.id);
    if (!fresh.length) return;
    setJustArrived((prev) => new Set([...prev, ...fresh]));
    window.setTimeout(() => {
      setJustArrived((prev) => {
        const copy = new Set(prev);
        fresh.forEach((id) => copy.delete(id));
        return copy;
      });
    }, 15000);
  }, []);

  // The selected day.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/demo/fancynails/bookings?date=${date}&days=1`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (cancelled) return;
        const next: Booking[] = json.bookings ?? [];
        flagArrivals(date, next);
        setStorageMode(json.storageMode ?? null);
        setData({ date, bookings: next });
        setError("");
      } catch {
        if (!cancelled) setError("Couldn't reach the booking system.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [date, reloadToken, flagArrivals]);

  // The week strip. A failure here is cosmetic, so it stays quiet.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/demo/fancynails/bookings?date=${weekStart}&days=7`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (cancelled) return;
        const counts: Record<string, number> = {};
        for (const day of json.range ?? []) {
          counts[day.date] = (day.bookings as Booking[]).filter(
            (b) => b.status !== "cancelled"
          ).length;
        }
        setWeekCounts(counts);
      } catch {
        /* ignored on purpose */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [weekStart, reloadToken]);

  // Live refresh, paused while the tab is hidden.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, POLL_MS);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  async function setStatus(b: Booking, status: BookingStatus) {
    setBusyId(b.id);
    try {
      await fetch(`/api/demo/fancynails/bookings/${b.id}?date=${b.date}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(b: Booking) {
    setBusyId(b.id);
    try {
      await fetch(`/api/demo/fancynails/bookings/${b.id}?date=${b.date}`, {
        method: "DELETE",
      });
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function reset() {
    if (
      !window.confirm(
        "Clear every appointment in the demo and start from a fresh example day?"
      )
    )
      return;
    await fetch("/api/demo/fancynails/reset", { method: "POST" });
    seen.current = null;
    setData(null);
    refresh();
  }

  const active = (bookings ?? []).filter((b) => b.status !== "cancelled");
  const takings = active
    .filter((b) => b.status !== "no-show")
    .reduce((sum, b) => sum + (b.price ?? 0), 0);
  const minutesBooked = active
    .filter((b) => b.status !== "no-show")
    .reduce((sum, b) => sum + b.minutes, 0);

  return (
    <div className="min-h-screen bg-[#f6f2ef] text-[#3a3033]">
      <style>{PRINT_CSS}</style>

      {/* ── Screen header ───────────────────────────────────────────── */}
      <header className="no-print border-b border-[#e6d8d2] bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-baseline gap-3">
            <a
              href="/demo/fancynails"
              className={`text-2xl font-semibold tracking-tight ${serif}`}
            >
              {SALON.name}
            </a>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#b76e79]">
              Front desk
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[#eef3f0] px-3 py-1.5 text-[11px] font-medium text-[#3f6152]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4a7c5d] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4a7c5d]" />
              </span>
              Live
            </span>
            <a
              href="/demo/fancynails"
              className="rounded-full border border-[#e0cec8] px-4 py-1.5 text-xs font-medium text-[#6b5f62] transition-colors hover:border-[#b76e79] hover:text-[#b76e79]"
            >
              ← Back to the proposal
            </a>
          </div>
        </div>
      </header>

      {/* ── What am I looking at (for the owner, unaccompanied) ─────── */}
      <div className="no-print border-b border-[#e6d8d2] bg-[#3a3033]">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <p className="text-[13px] leading-relaxed text-[#ddd0cc]">
            <strong className="font-semibold text-white">
              This is your side of it.
            </strong>{" "}
            Every appointment on one page — the ones booked online, the ones you
            took on the phone, and the ones who walked in. Add one yourself with{" "}
            <strong className="font-semibold text-white">Write one in</strong>,
            and press{" "}
            <strong className="font-semibold text-white">Print this page</strong>{" "}
            for the paper copy at the desk.
          </p>
        </div>
      </div>

      {storageMode === "memory" && (
        <div className="no-print bg-[#fbf3e6] px-4 py-2.5 text-center text-xs text-[#7a6849] sm:px-6">
          Running on local storage — bookings won&apos;t sync between devices. Add
          the Upstash Redis env vars to share them.
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {/* ── Week strip + date nav ─────────────────────────────────── */}
        <div className="no-print">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setDate(addDays(date, -1))}
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[#e0cec8] bg-white text-[#6b5f62] transition-colors hover:border-[#b76e79] hover:text-[#b76e79]"
              aria-label="Previous day"
            >
              ←
            </button>
            <div className="min-w-0 text-center">
              <p className={`truncate text-2xl font-semibold ${serif}`}>
                {relativeDateLabel(date, today)}
              </p>
              <p className="text-xs text-[#a3969a]">{formatDateLong(date)}</p>
            </div>
            <button
              type="button"
              onClick={() => setDate(addDays(date, 1))}
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[#e0cec8] bg-white text-[#6b5f62] transition-colors hover:border-[#b76e79] hover:text-[#b76e79]"
              aria-label="Next day"
            >
              →
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).map((d) => {
              const selected = d === date;
              const count = weekCounts[d];
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDate(d)}
                  aria-pressed={selected}
                  className={`rounded-xl border px-1 py-2.5 text-center transition-colors ${
                    selected
                      ? "border-[#b76e79] bg-[#b76e79] text-white"
                      : "border-[#e6d8d2] bg-white text-[#3a3033] hover:border-[#b76e79]"
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-wide opacity-70">
                    {weekdayShort(d)}
                  </span>
                  <span className="mt-0.5 block text-lg font-semibold tabular-nums">
                    {dayOfMonth(d)}
                  </span>
                  <span
                    className={`mt-0.5 block text-[10px] tabular-nums ${
                      selected ? "text-white/80" : "text-[#a3969a]"
                    }`}
                  >
                    {count === undefined ? "·" : count === 0 ? "—" : `${count} in`}
                  </span>
                  {d === today && (
                    <span
                      className={`mx-auto mt-1 block h-1 w-1 rounded-full ${
                        selected ? "bg-white" : "bg-[#b76e79]"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {date !== today && (
            <button
              type="button"
              onClick={() => setDate(today)}
              className="mt-3 text-sm font-medium text-[#b76e79] hover:underline"
            >
              Jump back to today
            </button>
          )}
        </div>

        {/* ── Summary ──────────────────────────────────────────────── */}
        <div className="no-print mt-6 grid grid-cols-3 gap-3">
          <Stat label="In the book" value={String(active.length)} />
          <Stat label="Chair time" value={compactDuration(minutesBooked)} />
          <Stat label="Expected" value={`$${takings}`} />
        </div>

        {/* ── Actions ──────────────────────────────────────────────── */}
        <div className="no-print mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            className="rounded-full bg-[#3a3033] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#241d1f]"
          >
            {showAdd ? "Close" : "+ Write one in"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full border border-[#dcc8c2] bg-white px-5 py-2.5 text-sm font-semibold text-[#3a3033] transition-colors hover:border-[#b76e79] hover:text-[#b76e79]"
          >
            Print this page
          </button>
          <button
            type="button"
            onClick={reset}
            className="ml-auto rounded-full border border-[#e0cec8] bg-white px-5 py-2.5 text-sm font-medium text-[#a3969a] transition-colors hover:border-[#b76e79] hover:text-[#b76e79]"
          >
            Start fresh
          </button>
        </div>

        {showAdd && (
          <AddByHand
            date={date}
            onDone={() => {
              setShowAdd(false);
              refresh();
            }}
          />
        )}

        {error && (
          <p className="no-print mt-4 rounded-lg border border-[#e7c7c7] bg-[#fdf2f2] px-4 py-3 text-sm text-[#9a4b4b]">
            {error}
          </p>
        )}

        {/* ── Print-only sheet header ──────────────────────────────── */}
        <div className="print-only mb-4 hidden border-b-2 border-black pb-2">
          <div className="flex items-baseline justify-between">
            <h1 className="text-xl font-bold">{SALON.name} — appointment sheet</h1>
            <span className="text-sm">{formatDateLong(date)}</span>
          </div>
          <p className="mt-1 text-xs">
            {active.length} booked · {compactDuration(minutesBooked)} of chair
            time · ${takings} expected · {SALON.phoneDisplay}
          </p>
        </div>

        {/* ── The day ──────────────────────────────────────────────── */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-[#e6d8d2] bg-white">
          {bookings === null ? (
            <p className="px-5 py-10 text-center text-sm text-[#a3969a]">
              Opening the book…
            </p>
          ) : bookings.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className={`text-xl font-semibold ${serif}`}>Nothing booked in</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#6b5f62]">
                An empty day. Either it&apos;s closed, or nobody&apos;s in the book
                yet — press <strong>Write one in</strong> to add somebody the way
                you would over the phone.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#f0e6e2]">
              {bookings.map((b) => (
                <li
                  key={b.id}
                  className={`px-4 py-4 transition-colors sm:px-5 ${STATUS_STYLE[b.status]} ${
                    justArrived.has(b.id) ? "bg-[#f2f8f4]" : ""
                  }`}
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-[4.5rem] flex-none sm:w-20">
                      <p className="text-[15px] font-bold tabular-nums">
                        {formatTime(b.start)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#a3969a]">
                        {formatDuration(b.minutes)}
                      </p>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p
                          className={`text-[15px] font-semibold ${
                            b.status === "cancelled" ? "line-through" : ""
                          }`}
                        >
                          {b.name}
                        </p>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${SOURCE_STYLE[b.source]}`}
                        >
                          {SOURCE_LABEL[b.source]}
                        </span>
                        {justArrived.has(b.id) && (
                          <span className="no-print rounded-full bg-[#4a7c5d] px-2 py-0.5 text-[10px] font-semibold text-white">
                            just booked
                          </span>
                        )}
                        {b.status === "done" && (
                          <span className="rounded-full bg-[#eef3f0] px-2 py-0.5 text-[10px] font-medium text-[#3f6152]">
                            done
                          </span>
                        )}
                        {b.status === "no-show" && (
                          <span className="rounded-full bg-[#fdf2f2] px-2 py-0.5 text-[10px] font-medium text-[#9a4b4b]">
                            no-show
                          </span>
                        )}
                        {b.status === "cancelled" && (
                          <span className="rounded-full bg-[#f2efee] px-2 py-0.5 text-[10px] font-medium text-[#8a8083]">
                            cancelled
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-sm text-[#6b5f62]">
                        {b.serviceName}
                        {b.price !== null && (
                          <span className="text-[#a3969a]">
                            {" "}
                            · {formatPrice(b.price)}
                          </span>
                        )}
                      </p>

                      <p className="mt-0.5 text-sm text-[#6b5f62]">
                        <a
                          href={`tel:${b.phone.replace(/\D/g, "")}`}
                          className="tabular-nums hover:text-[#b76e79]"
                        >
                          {b.phone}
                        </a>
                        <span className="no-print text-[#c3b7ba]">
                          {" "}
                          · ref {b.id}
                        </span>
                      </p>

                      {b.notes && (
                        <p className="mt-1.5 rounded-lg bg-[#faf6f4] px-3 py-2 text-[13px] leading-relaxed text-[#6b5f62]">
                          {b.notes}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="no-print mt-2.5 flex flex-wrap gap-1.5">
                        {b.status === "booked" ? (
                          <>
                            <MiniButton
                              onClick={() => setStatus(b, "done")}
                              disabled={busyId === b.id}
                            >
                              Mark done
                            </MiniButton>
                            <MiniButton
                              onClick={() => setStatus(b, "no-show")}
                              disabled={busyId === b.id}
                            >
                              No-show
                            </MiniButton>
                            <MiniButton
                              onClick={() => setStatus(b, "cancelled")}
                              disabled={busyId === b.id}
                            >
                              Cancel
                            </MiniButton>
                          </>
                        ) : (
                          <MiniButton
                            onClick={() => setStatus(b, "booked")}
                            disabled={busyId === b.id}
                          >
                            Put back
                          </MiniButton>
                        )}
                        <MiniButton
                          onClick={() => remove(b)}
                          disabled={busyId === b.id}
                          danger
                        >
                          Remove
                        </MiniButton>
                      </div>
                    </div>

                    {/* Paper tick box */}
                    <span
                      className="print-only hidden h-5 w-5 flex-none border border-black"
                      aria-hidden="true"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="no-print mt-5 text-center text-xs leading-relaxed text-[#a3969a]">
          The salon can take {CAPACITY} at once, so the system stops offering a
          time once {CAPACITY} are in it — that&apos;s how it avoids writing two
          people into the same slot. Change that number and everything follows.
        </p>

        {/* ── Closing reassurance ──────────────────────────────────── */}
        <div className="no-print mt-8 rounded-2xl border border-[#e6d2b8] bg-[#fbf3e6] p-6">
          <p className={`text-2xl font-semibold text-[#5f4e2b] ${serif}`}>
            Free for {TRIAL.days} days
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#7a6849]">
            Run this next to the paper book for a month. Nothing to install, no
            card, nothing to cancel. If it hasn&apos;t made the day easier by the
            end of it, we shake hands and you&apos;ve lost nothing.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="/demo/fancynails#try-it"
              className="rounded-full bg-[#3a3033] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#241d1f]"
            >
              Back to the proposal
            </a>
            <a
              href="mailto:connorgorman@live.ca?subject=Fancy%20Nails%20booking%20page"
              className="rounded-full border border-[#d9c8a8] bg-white px-5 py-2.5 text-sm font-semibold text-[#5f4e2b] transition-colors hover:border-[#b76e79] hover:text-[#b76e79]"
            >
              Ask a question
            </a>
          </div>
        </div>

        <p className="no-print mt-8 text-center text-xs text-[#c3b7ba]">
          Demo system · not the official {SALON.fullName} booking page
        </p>
      </main>
    </div>
  );
}

/* ─── Bits ────────────────────────────────────────────────────────────────── */

/** 685 → "11h 25m", 60 → "1h", 45 → "45m" */
function compactDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#e6d8d2] bg-white px-3 py-3 text-center sm:px-4">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wide text-[#a3969a]">
        {label}
      </p>
    </div>
  );
}

function MiniButton({
  children,
  onClick,
  disabled,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-40 ${
        danger
          ? "border-[#ecd6d6] text-[#a56a6a] hover:border-[#c98a8a] hover:bg-[#fdf2f2]"
          : "border-[#e6d8d2] text-[#6b5f62] hover:border-[#b76e79] hover:text-[#b76e79]"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Writing in a phone or walk-in booking by hand. This is the feature that
 * answers "but I take most of them on the phone" — the same list, her entry.
 */
function AddByHand({
  date,
  onDone,
}: {
  date: string;
  onDone: () => void | Promise<void>;
}) {
  const [serviceId, setServiceId] = useState(BOOKABLE_SERVICES[0].id);
  const [start, setStart] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [source, setSource] = useState<BookingSource>("phone");
  const [slots, setSlots] = useState<{ start: string; available: boolean }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/demo/fancynails/availability?date=${date}&serviceId=${serviceId}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (!cancelled) {
          setSlots(json.slots ?? []);
          setStart("");
        }
      } catch {
        if (!cancelled) setSlots([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [date, serviceId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/demo/fancynails/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, start, serviceId, name, phone, notes, source }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Couldn't save that one.");
        return;
      }
      await onDone();
    } catch {
      setError("Couldn't reach the booking system.");
    } finally {
      setSaving(false);
    }
  }

  const service = findService(serviceId);

  return (
    <form
      onSubmit={submit}
      className="no-print mt-4 rounded-2xl border border-[#e6d8d2] bg-white p-5 sm:p-6"
    >
      <h2 className={`text-xl font-semibold ${serif}`}>
        Write one in — {relativeDateLabel(date, todayISO())}
      </h2>
      <p className="mt-1 text-sm text-[#6b5f62]">
        Same as writing it in the book, except it also shows up on everyone
        else&apos;s screen.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Who called?">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={inputCls}
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="613-555-0100"
            className={inputCls}
          />
        </Field>
        <Field label="Service" className="sm:col-span-2">
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className={inputCls}
          >
            {BOOKABLE_SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {formatDuration(s.minutes)} · {formatPrice(s.price)}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Time"
          className="sm:col-span-2"
          hint={
            service
              ? `Greyed-out times already have ${CAPACITY} people in them.`
              : undefined
          }
        >
          {slots.length === 0 ? (
            <p className="text-sm text-[#a3969a]">
              Closed that day, or no room left for this service.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
              {slots.map((s) => (
                <button
                  key={s.start}
                  type="button"
                  disabled={!s.available}
                  onClick={() => setStart(s.start)}
                  className={`rounded-lg border px-1 py-2 text-xs font-medium tabular-nums transition-colors ${
                    start === s.start
                      ? "border-[#b76e79] bg-[#b76e79] text-white"
                      : s.available
                        ? "border-[#e6d5ce] bg-white text-[#3a3033] hover:border-[#b76e79]"
                        : "cursor-not-allowed border-[#f3eae7] bg-[#f7f1ee] text-[#cbbfc2] line-through"
                  }`}
                >
                  {formatTime(s.start)}
                </button>
              ))}
            </div>
          )}
        </Field>
        <Field label="How did they book?" className="sm:col-span-2">
          <div className="flex gap-2">
            {(["phone", "walk-in", "online"] as BookingSource[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSource(s)}
                aria-pressed={source === s}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  source === s
                    ? "border-[#b76e79] bg-[#b76e79] text-white"
                    : "border-[#e6d5ce] bg-white text-[#6b5f62] hover:border-[#b76e79]"
                }`}
              >
                {SOURCE_LABEL[s]}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Notes (optional)" className="sm:col-span-2">
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Colour, allergies, regular client…"
            className={`${inputCls} resize-none`}
          />
        </Field>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-[#e7c7c7] bg-[#fdf2f2] px-4 py-3 text-sm text-[#9a4b4b]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving || !start}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#3a3033] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#241d1f] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "Saving…" : <>
          <Check className="h-4 w-4" /> Add to the book
        </>}
      </button>
    </form>
  );
}

/* Paper is the point — the printed sheet has to look like the page she'd have
   written by hand, not like a screenshot of a website. */
const PRINT_CSS = `
@media screen { .print-only { display: none !important; } }
@media print {
  .no-print { display: none !important; }
  .print-only { display: block !important; }
  .print-only.hidden { display: block !important; }
  span.print-only { display: inline-block !important; }
  * { background: #fff !important; color: #000 !important; box-shadow: none !important; }
  main { max-width: none !important; padding: 0 !important; }
  section { border: none !important; border-radius: 0 !important; }
  li { break-inside: avoid; page-break-inside: avoid; border-bottom: 1px solid #bbb !important; padding: 5px 0 !important; }
  li p { margin: 0 !important; line-height: 1.35 !important; }
  .rounded-2xl, .rounded-xl, .rounded-lg { border-radius: 0 !important; }
  a { text-decoration: none !important; }
  @page { margin: 14mm; }
}
`;
