"use client";

import { useState } from "react";

/* ────────────────────────────────────────────────────────────────────────
   Fancy Nails design demo (placeholder content)
   Palette is intentionally self-contained (warm cream + rose-gold) so it
   reads as a nail salon, independent of the portfolio's dark theme.
   Swap the PhotoSlot blocks for real imagery when available.
   ──────────────────────────────────────────────────────────────────────── */

const PHONE_DISPLAY = "613-766-0877";
const PHONE_TEL = "6137660877";
const ADDRESS = "255 Bagot St Unit A, Kingston, ON K7L 3G4";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=255+Bagot+St+Unit+A+Kingston+ON+K7L+3G4";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#book", label: "Book" },
  { href: "#visit", label: "Visit" },
];

const SERVICES = [
  {
    name: "Manicures",
    desc: "Classic, gel, and spa manicures with a shape and finish to suit you.",
  },
  {
    name: "Pedicures",
    desc: "Relaxing spa pedicures with a soak, scrub, and polish, start to finish.",
  },
  {
    name: "Gel & Acrylic",
    desc: "Long-lasting gel overlays, full sets, and fills with a flawless finish.",
  },
  {
    name: "Nail Art",
    desc: "Custom designs, French, chrome, and seasonal accents by request.",
  },
  {
    name: "Waxing",
    desc: "Gentle facial and body waxing for brows, lip, arms, legs, and more.",
  },
  {
    name: "Add-ons",
    desc: "Paraffin dips, extended massage, and nail repair to round things out.",
  },
];

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM",
  "5:30 PM",
];

const HOURS = [
  { day: "Mon – Fri", time: "9:30 AM – 7:30 PM" },
  { day: "Saturday", time: "9:30 AM – 6:00 PM" },
  { day: "Sunday", time: "11:00 AM – 5:00 PM" },
];

/** A labelled placeholder where a real photo will go. */
function PhotoSlot({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-[#ecdcd4] bg-gradient-to-br from-[#f7ece7] to-[#efdcd6] text-[#b98f86] ${className}`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10" r="1.5" />
          <path d="m21 16-4.5-4.5L7 21" />
        </svg>
        <span className="font-sans text-xs tracking-wide">{label}</span>
      </div>
    </div>
  );
}

export function FancyNailsDemo() {
  const [submitted, setSubmitted] = useState(false);
  const [slot, setSlot] = useState("");

  return (
    <div className="min-h-screen bg-[#fbf7f4] font-sans text-[#3a3033] [font-family:var(--font-geist-sans)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#efe0da] bg-[#fbf7f4]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#top" className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-semibold tracking-tight text-[#3a3033] [font-family:var(--font-cormorant)]">
              Fancy Nails
            </span>
            <span className="hidden font-sans text-[11px] uppercase tracking-[0.2em] text-[#b76e79] sm:inline">
              Kingston
            </span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-sans text-sm text-[#6b5f62] transition-colors hover:text-[#b76e79]"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#book"
            className="rounded-full bg-[#b76e79] px-5 py-2 font-sans text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#9a5560]"
          >
            Book now
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="font-sans text-sm uppercase tracking-[0.25em] text-[#b76e79]">
              Nails &amp; Waxing · Downtown Kingston
            </p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-[#3a3033] [font-family:var(--font-cormorant)] md:text-6xl">
              Polished, pampered,
              <br />
              perfectly you.
            </h1>
            <p className="mt-5 max-w-md font-sans text-[15px] leading-relaxed text-[#6b5f62]">
              A calm, welcoming studio for manicures, pedicures, custom nail
              art, and gentle waxing in the heart of downtown Kingston.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#book"
                className="rounded-full bg-[#b76e79] px-6 py-3 font-sans text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#9a5560]"
              >
                Book an appointment
              </a>
              <a
                href={`tel:${PHONE_TEL}`}
                className="rounded-full border border-[#e0cec8] bg-white px-6 py-3 font-sans text-sm font-medium text-[#3a3033] transition-colors hover:border-[#b76e79] hover:text-[#b76e79]"
              >
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
          <PhotoSlot
            label="Hero photo (nails / studio)"
            className="aspect-[4/5] w-full md:aspect-[4/5]"
          />
        </section>

        {/* Services */}
        <section id="services" className="border-t border-[#efe0da] bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <div className="max-w-xl">
              <h2 className="font-serif text-4xl font-semibold tracking-tight text-[#3a3033] [font-family:var(--font-cormorant)]">
                Services
              </h2>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-[#6b5f62]">
                A little something for every occasion.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => (
                <div
                  key={s.name}
                  className="rounded-xl border border-[#f0e3dd] bg-[#fdfaf8] p-6 transition-shadow hover:shadow-md"
                >
                  <h3 className="font-serif text-2xl font-medium text-[#3a3033] [font-family:var(--font-cormorant)]">
                    {s.name}
                  </h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-[#6b5f62]">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="border-t border-[#efe0da]">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-4xl font-semibold tracking-tight text-[#3a3033] [font-family:var(--font-cormorant)]">
                  Our work
                </h2>
                <p className="mt-3 max-w-md font-sans text-[15px] leading-relaxed text-[#6b5f62]">
                  A few placeholder spots for real photos of your favorite sets
                  and designs.
                </p>
              </div>
              <a
                href="#book"
                className="font-sans text-sm font-medium text-[#b76e79] transition-colors hover:text-[#9a5560]"
              >
                Book your look →
              </a>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              <PhotoSlot label="Nail photo 1" className="aspect-square" />
              <PhotoSlot label="Nail photo 2" className="aspect-square" />
              <PhotoSlot label="Nail photo 3" className="aspect-square" />
              <PhotoSlot label="Nail photo 4" className="aspect-square" />
              <PhotoSlot
                label="Nail photo 5"
                className="aspect-square sm:col-span-1"
              />
              <PhotoSlot
                label="Nail photo 6"
                className="aspect-square sm:col-span-1"
              />
              <PhotoSlot
                label="Nail photo 7"
                className="col-span-2 aspect-[2/1] md:col-span-2 md:aspect-[2/1]"
              />
            </div>
          </div>
        </section>

        {/* Booking */}
        <section id="book" className="border-t border-[#efe0da] bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-20">
            <div>
              <h2 className="font-serif text-4xl font-semibold tracking-tight text-[#3a3033] [font-family:var(--font-cormorant)]">
                Request an appointment
              </h2>
              <p className="mt-3 max-w-md font-sans text-[15px] leading-relaxed text-[#6b5f62]">
                Send a request and we&apos;ll confirm your time by phone. Prefer
                to talk? Call us at{" "}
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="font-medium text-[#b76e79] hover:underline"
                >
                  {PHONE_DISPLAY}
                </a>
                .
              </p>
              <div className="mt-8 space-y-3 rounded-xl border border-[#f0e3dd] bg-[#fdfaf8] p-6">
                <p className="font-serif text-xl font-medium text-[#3a3033] [font-family:var(--font-cormorant)]">
                  Walk-ins welcome
                </p>
                <p className="font-sans text-sm leading-relaxed text-[#6b5f62]">
                  Booking ahead is recommended for gel, full sets, and weekend
                  visits.
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="flex flex-col items-start justify-center rounded-xl border border-[#e6d2b8] bg-[#fbf3e6] p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#b76e79] text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="mt-4 font-serif text-2xl font-medium text-[#3a3033] [font-family:var(--font-cormorant)]">
                  Request received
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-[#6b5f62]">
                  This is a demo, so nothing was actually booked. On the live
                  site this would notify the salon and send you a confirmation.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSlot("");
                  }}
                  className="mt-5 rounded-full border border-[#e0cec8] bg-white px-5 py-2 font-sans text-sm font-medium text-[#3a3033] transition-colors hover:border-[#b76e79] hover:text-[#b76e79]"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="rounded-xl border border-[#f0e3dd] bg-[#fdfaf8] p-6 sm:p-8"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name">
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      type="tel"
                      required
                      placeholder="613-555-0100"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Service" className="sm:col-span-2">
                    <select required className={inputCls} defaultValue="">
                      <option value="" disabled>
                        Choose a service…
                      </option>
                      {SERVICES.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Date" className="sm:col-span-2">
                    <input type="date" required className={inputCls} />
                  </Field>
                  <Field label="Available times" className="sm:col-span-2">
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((t) => {
                        const active = slot === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setSlot(t)}
                            aria-pressed={active}
                            className={`rounded-lg border px-3 py-2.5 font-sans text-sm font-medium transition-colors ${
                              active
                                ? "border-[#b76e79] bg-[#b76e79] text-white"
                                : "border-[#e6d5ce] bg-white text-[#3a3033] hover:border-[#b76e79] hover:text-[#b76e79]"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  <Field label="Notes (optional)" className="sm:col-span-2">
                    <textarea
                      rows={3}
                      placeholder="Anything we should know?"
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                </div>
                <button
                  type="submit"
                  disabled={!slot}
                  className="mt-6 w-full rounded-full bg-[#b76e79] px-6 py-3 font-sans text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#9a5560] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Request appointment
                </button>
                <p className="mt-3 text-center font-sans text-xs text-[#a3969a]">
                  Demo form, submissions are not sent anywhere.
                </p>

                {/* Connor's capability note for the pitch */}
                <div className="mt-5 rounded-lg border border-dashed border-[#d8bfc3] bg-[#f9eef0] p-4">
                  <p className="font-sans text-xs leading-relaxed text-[#8a5560]">
                    <span className="font-semibold">Note for Fancy Nails:</span> I
                    can wire this straight into an Outlook calendar so every
                    booking drops in automatically, or have it text you the
                    details when someone books.
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Visit */}
        <section id="visit" className="border-t border-[#efe0da]">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-20">
            <div>
              <h2 className="font-serif text-4xl font-semibold tracking-tight text-[#3a3033] [font-family:var(--font-cormorant)]">
                Visit us
              </h2>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-[#b76e79]">
                    Location
                  </p>
                  <p className="mt-1 font-sans text-[15px] text-[#3a3033]">
                    {ADDRESS}
                  </p>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block font-sans text-sm font-medium text-[#b76e79] hover:underline"
                  >
                    Get directions →
                  </a>
                </div>

                <div>
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-[#b76e79]">
                    Phone
                  </p>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="mt-1 inline-block font-sans text-[15px] text-[#3a3033] hover:text-[#b76e79]"
                  >
                    {PHONE_DISPLAY}
                  </a>
                </div>

                <div>
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-[#b76e79]">
                    Hours
                  </p>
                  <dl className="mt-2 space-y-1.5">
                    {HOURS.map((h) => (
                      <div
                        key={h.day}
                        className="flex justify-between gap-6 font-sans text-sm"
                      >
                        <dt className="text-[#6b5f62]">{h.day}</dt>
                        <dd className="text-[#3a3033]">{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <PhotoSlot
                label="Map / storefront photo"
                className="aspect-[4/3] w-full transition-shadow group-hover:shadow-md md:aspect-auto md:h-full"
              />
            </a>
          </div>
        </section>

        {/* Connor's capability pitch to the salon */}
        <section className="border-t border-[#efe0da] bg-[#3a3033]">
          <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-[#d8a9b0]">
              Beyond the website
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold tracking-tight text-[#f6ece9] [font-family:var(--font-cormorant)] md:text-4xl">
              Things I can set up to bring clients back
            </h2>
            <ul className="mt-8 grid gap-x-10 gap-y-4 font-sans text-[15px] text-[#e7dcd8] sm:grid-cols-2">
              {[
                "Appointment reminders that cut down no-shows",
                "Recall offers that nudge past clients to rebook",
                "Automatic booking sync to your Outlook calendar",
                "Text confirmations when someone books",
                "Birthday and loyalty perks for regulars",
                "Simple review requests after each visit",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#b76e79]"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#efe0da] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-semibold text-[#3a3033] [font-family:var(--font-cormorant)]">
              Fancy Nails
            </span>
            <span className="font-sans text-xs text-[#a3969a]">
              {ADDRESS}
            </span>
          </div>
          <div className="flex items-center gap-5 font-sans text-sm text-[#6b5f62]">
            <a href={`tel:${PHONE_TEL}`} className="hover:text-[#b76e79]">
              {PHONE_DISPLAY}
            </a>
            <a href="#book" className="hover:text-[#b76e79]">
              Book
            </a>
          </div>
        </div>
        <p className="pb-6 text-center font-sans text-xs text-[#c3b7ba]">
          Design demo · not the official Fancy Nails website
        </p>
      </footer>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-[#e6d5ce] bg-white px-3.5 py-2.5 font-sans text-sm text-[#3a3033] placeholder:text-[#b6a9ac] outline-none transition-colors focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/25";

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wide text-[#6b5f62]">
        {label}
      </span>
      {children}
    </label>
  );
}
