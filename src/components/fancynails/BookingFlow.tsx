"use client";

import { useEffect, useState } from "react";
import {
  BOOKABLE_SERVICES,
  BOOKING_WINDOW_DAYS,
  SALON,
  SERVICE_CATEGORIES,
  formatDuration,
  formatPrice,
  formatTime,
  type Service,
} from "@/lib/fancynails/config";
import {
  addDays,
  dayOfMonth,
  formatDateLong,
  monthShort,
  relativeDateLabel,
  todayISO,
  weekdayShort,
} from "@/lib/fancynails/dates";
import { Check, Field, inputCls, serif } from "./shared";

/* ══════════════════════════════════════════════════════════════════════════
   The customer side of the booking. Four steps, one decision each, so it can
   be finished on a phone without instructions.

   Times come from the server, not from a hard-coded list — they're the real
   opening hours minus what's already in the book. That's why the demo can
   claim it won't double-book: it genuinely won't.
   ══════════════════════════════════════════════════════════════════════════ */

type Slot = { start: string; available: boolean };

type Booking = {
  id: string;
  date: string;
  start: string;
  serviceName: string;
  name: string;
};

const STEPS = ["Service", "Day", "Time", "Details"] as const;

export function BookingFlow() {
  const [today] = useState(todayISO);
  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");

  /* Slots are keyed by date+service so a stale response for a previous
     selection can never be shown against the current one. */
  const [slotData, setSlotData] = useState<{
    key: string;
    slots: Slot[];
    closed: boolean;
  } | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const days = Array.from({ length: BOOKING_WINDOW_DAYS }, (_, i) =>
    addDays(today, i)
  );

  const slotKey = date && service ? `${date}|${service.id}` : "";
  const current = slotData?.key === slotKey ? slotData : null;
  const slots = current?.slots ?? null;
  const closed = current?.closed ?? false;
  const loadingSlots = Boolean(slotKey) && current === null;

  useEffect(() => {
    if (!slotKey) return;
    let cancelled = false;
    (async () => {
      const [d, serviceId] = slotKey.split("|");
      try {
        const res = await fetch(
          `/api/demo/fancynails/availability?date=${d}&serviceId=${serviceId}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (cancelled) return;
        setSlotData({
          key: slotKey,
          slots: json.slots ?? [],
          closed: Boolean(json.closed),
        });
      } catch {
        if (cancelled) return;
        setSlotData({ key: slotKey, slots: [], closed: false });
        setError("Couldn't load times. Check the connection and try again.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slotKey, reloadToken]);

  function pickService(s: Service) {
    setService(s);
    setStart("");
    setStep(1);
  }

  function pickDate(d: string) {
    setDate(d);
    setStart("");
    setStep(2);
  }

  function pickTime(t: string) {
    setStart(t);
    setStep(3);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!service || !date || !start) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/demo/fancynails/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          start,
          serviceId: service.id,
          name,
          phone,
          notes,
          source: "online",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        // The slot may have gone while they were typing — reload and step back.
        if (res.status === 409) {
          setSlotData(null);
          setReloadToken((t) => t + 1);
          setStart("");
          setStep(2);
        }
        return;
      }
      setConfirmed(json.booking);
    } catch {
      setError("Couldn't reach the salon's system. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function startOver() {
    setConfirmed(null);
    setService(null);
    setDate("");
    setStart("");
    setSlotData(null);
    setName("");
    setPhone("");
    setNotes("");
    setError("");
    setStep(0);
  }

  /* ── Confirmed ──────────────────────────────────────────────────────── */
  if (confirmed) {
    return (
      <div className="rounded-2xl border border-[#cfe0d4] bg-[#f2f8f4] p-6 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4a7c5d] text-white">
          <Check className="h-6 w-6" />
        </div>
        <h3 className={`mt-5 text-3xl font-semibold text-[#2c3b32] ${serif}`}>
          You&apos;re booked in
        </h3>
        <dl className="mt-6 space-y-2.5 border-y border-[#d8e7dd] py-5 text-[15px]">
          <Row label="Service" value={confirmed.serviceName} />
          <Row label="When" value={formatDateLong(confirmed.date)} />
          <Row label="Time" value={formatTime(confirmed.start)} />
          <Row label="Name" value={confirmed.name} />
          <Row label="Reference" value={confirmed.id} mono />
        </dl>
        <p className="mt-5 text-sm leading-relaxed text-[#4a5c50]">
          That appointment is now in the salon&apos;s book — nobody had to write it
          down or go and check a platform.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={`/demo/fancynails/desk?date=${confirmed.date}`}
            className="rounded-full bg-[#3a3033] px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#241d1f]"
          >
            See it in the book →
          </a>
          <button
            type="button"
            onClick={startOver}
            className="rounded-full border border-[#c6d8cc] bg-white px-6 py-3 text-sm font-semibold text-[#2c3b32] transition-colors hover:border-[#4a7c5d]"
          >
            Book another
          </button>
        </div>

        <p className="mt-5 rounded-lg bg-[#e6f0ea] px-4 py-3 text-xs leading-relaxed text-[#4a5c50]">
          On the live version this is also where a text or email confirmation
          would go out, and a reminder the day before.
        </p>
      </div>
    );
  }

  /* ── Flow ───────────────────────────────────────────────────────────── */
  return (
    <div className="rounded-2xl border border-[#f0e3dd] bg-[#fdfaf8] p-5 sm:p-7">
      {/* Progress */}
      <ol className="flex items-center gap-1.5">
        {STEPS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={label} className="flex flex-1 flex-col gap-1.5">
              <span
                className={`h-1 rounded-full transition-colors ${
                  done || current ? "bg-[#b76e79]" : "bg-[#eadcd7]"
                }`}
              />
              <button
                type="button"
                disabled={i > step}
                onClick={() => setStep(i)}
                className={`text-left text-[11px] font-medium uppercase tracking-wide transition-colors disabled:cursor-default ${
                  done || current ? "text-[#b76e79]" : "text-[#c3b7ba]"
                }`}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-6">
        {/* Step 1 — service */}
        {step === 0 && (
          <div>
            <h3 className={`text-2xl font-semibold text-[#3a3033] ${serif}`}>
              What are you booking?
            </h3>
            <div className="mt-5 space-y-6">
              {SERVICE_CATEGORIES.filter((cat) =>
                BOOKABLE_SERVICES.some((s) => s.category === cat)
              ).map((cat) => (
                <div key={cat}>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#b76e79]">
                    {cat}
                  </p>
                  <div className="mt-2.5 space-y-2">
                    {BOOKABLE_SERVICES.filter((s) => s.category === cat).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => pickService(s)}
                        className="flex w-full items-start gap-3 rounded-xl border border-[#eadcd7] bg-white px-4 py-3.5 text-left transition-colors hover:border-[#b76e79] hover:bg-[#fdf6f7]"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-medium text-[#3a3033]">
                            {s.name}
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-[#6b5f62]">
                            {s.desc}
                          </span>
                        </span>
                        <span className="flex-none text-right">
                          <span className="block text-[15px] font-semibold text-[#3a3033]">
                            {formatPrice(s.price)}
                          </span>
                          <span className="mt-0.5 block text-xs text-[#a3969a]">
                            {formatDuration(s.minutes)}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — day */}
        {step === 1 && service && (
          <div>
            <h3 className={`text-2xl font-semibold text-[#3a3033] ${serif}`}>
              Which day?
            </h3>
            <p className="mt-1.5 text-sm text-[#6b5f62]">
              {service.name} · {formatDuration(service.minutes)}
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {days.map((d) => {
                const active = date === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => pickDate(d)}
                    aria-pressed={active}
                    className={`rounded-xl border px-2 py-3 text-center transition-colors ${
                      active
                        ? "border-[#b76e79] bg-[#b76e79] text-white"
                        : "border-[#eadcd7] bg-white text-[#3a3033] hover:border-[#b76e79] hover:text-[#b76e79]"
                    }`}
                  >
                    <span className="block text-[11px] uppercase tracking-wide opacity-70">
                      {weekdayShort(d)}
                    </span>
                    <span className="mt-0.5 block text-xl font-semibold tabular-nums">
                      {dayOfMonth(d)}
                    </span>
                    <span className="block text-[11px] opacity-70">
                      {monthShort(d)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3 — time */}
        {step === 2 && service && date && (
          <div>
            <h3 className={`text-2xl font-semibold text-[#3a3033] ${serif}`}>
              Pick a time
            </h3>
            <p className="mt-1.5 text-sm text-[#6b5f62]">
              {relativeDateLabel(date, today)} · {service.name}
            </p>

            {loadingSlots && (
              <p className="mt-6 text-sm text-[#a3969a]">Checking the book…</p>
            )}

            {!loadingSlots && closed && (
              <p className="mt-6 rounded-xl border border-[#eadcd7] bg-white p-5 text-sm text-[#6b5f62]">
                We&apos;re closed that day — please pick another.
              </p>
            )}

            {!loadingSlots && !closed && slots && (
              <>
                {slots.every((s) => !s.available) ? (
                  <p className="mt-6 rounded-xl border border-[#eadcd7] bg-white p-5 text-sm text-[#6b5f62]">
                    Fully booked for {service.name} that day. Try another date, or
                    give us a ring on{" "}
                    <a
                      href={`tel:${SALON.phoneTel}`}
                      className="font-medium text-[#b76e79] hover:underline"
                    >
                      {SALON.phoneDisplay}
                    </a>
                    .
                  </p>
                ) : (
                  <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((s) => (
                      <button
                        key={s.start}
                        type="button"
                        disabled={!s.available}
                        onClick={() => pickTime(s.start)}
                        className={`rounded-lg border px-2 py-2.5 text-sm font-medium tabular-nums transition-colors ${
                          start === s.start
                            ? "border-[#b76e79] bg-[#b76e79] text-white"
                            : s.available
                              ? "border-[#eadcd7] bg-white text-[#3a3033] hover:border-[#b76e79] hover:text-[#b76e79]"
                              : "cursor-not-allowed border-[#f3eae7] bg-[#f7f1ee] text-[#cbbfc2] line-through"
                        }`}
                      >
                        {formatTime(s.start)}
                      </button>
                    ))}
                  </div>
                )}
                <p className="mt-4 text-xs leading-relaxed text-[#a3969a]">
                  Greyed-out times are already taken. This is live — it&apos;s
                  reading the salon&apos;s actual book.
                </p>
              </>
            )}
          </div>
        )}

        {/* Step 4 — details */}
        {step === 3 && service && date && start && (
          <form onSubmit={submit}>
            <h3 className={`text-2xl font-semibold text-[#3a3033] ${serif}`}>
              Nearly done
            </h3>

            <div className="mt-4 rounded-xl border border-[#eadcd7] bg-white p-4">
              <dl className="space-y-1.5 text-sm">
                <Row label="Service" value={service.name} />
                <Row label="When" value={relativeDateLabel(date, today)} />
                <Row
                  label="Time"
                  value={`${formatTime(start)} · ${formatDuration(service.minutes)}`}
                />
                <Row label="Price" value={formatPrice(service.price)} />
              </dl>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Your name">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
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
              <Field label="Anything we should know?" className="sm:col-span-2">
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Colour you have in mind, allergies, running late…"
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-[#b76e79] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#9a5560] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Booking…" : "Confirm appointment"}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-[#e7c7c7] bg-[#fdf2f2] px-4 py-3 text-sm text-[#9a4b4b]">
            {error}
          </p>
        )}

        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="mt-5 text-sm font-medium text-[#6b5f62] transition-colors hover:text-[#b76e79]"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="flex-none text-[#6b5f62]">{label}</dt>
      <dd
        className={`text-right font-medium text-[#3a3033] ${
          mono ? "font-mono tracking-wider" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
