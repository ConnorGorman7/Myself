import {
  GALLERY,
  HERO_PHOTO,
  HOURS_DISPLAY,
  SALON,
  SERVICE_CATEGORIES,
  SERVICES,
  STOREFRONT_PHOTO,
  TRIAL,
  formatDuration,
  formatPrice,
} from "@/lib/fancynails/config";
import { BookingFlow } from "./fancynails/BookingFlow";
import { PitchSection } from "./fancynails/PitchSection";
import { PhotoFrame, serif } from "./fancynails/shared";

/* ────────────────────────────────────────────────────────────────────────
   Fancy Nails demo.

   Two halves in one page, on purpose: the proposal the owner reads first,
   then the customer-facing site it's proposing. She scrolls straight from
   "why would I" into the thing itself.

   Everything editable lives in src/lib/fancynails/config.ts.
   ──────────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#book", label: "Book" },
  { href: "#visit", label: "Visit" },
];

export function FancyNailsDemo() {
  return (
    <div className="min-h-screen bg-[#fbf7f4] text-[#3a3033] [font-family:var(--font-geist-sans)]">
      {/* Demo banner — says what this is before anything else does */}
      <div className="bg-[#3a3033] px-5 py-2.5 text-center">
        <p className="text-xs leading-relaxed text-[#ddd0cc]">
          A working demo built for {SALON.fullName} ·{" "}
          <span className="font-semibold text-white">
            {TRIAL.days} days free
          </span>{" "}
          ·{" "}
          <a
            href="/demo/fancynails/desk"
            className="font-semibold text-[#e6b4bb] underline underline-offset-2 hover:text-white"
          >
            Open the front desk book
          </a>
        </p>
      </div>

      {/* ── The proposal ──────────────────────────────────────────────── */}
      <PitchSection />

      {/* ── The customer-facing site ──────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#efe0da] bg-[#fbf7f4]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4">
          <a href="#site-top" className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-semibold tracking-tight text-[#3a3033] ${serif}`}
            >
              {SALON.name}
            </span>
            <span className="hidden text-[11px] uppercase tracking-[0.2em] text-[#b76e79] sm:inline">
              Kingston
            </span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-[#6b5f62] transition-colors hover:text-[#b76e79]"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#book"
            className="flex-none rounded-full bg-[#b76e79] px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#9a5560]"
          >
            Book now
          </a>
        </div>
      </header>

      <main id="site-top">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#b76e79]">
              {SALON.tagline}
            </p>
            <h2
              className={`mt-4 text-5xl font-semibold leading-[1.05] tracking-tight text-[#3a3033] md:text-6xl ${serif}`}
            >
              Polished, pampered,
              <br />
              perfectly you.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#6b5f62]">
              A calm, welcoming studio for manicures, pedicures, custom nail
              art, and gentle waxing in the heart of downtown Kingston.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#book"
                className="rounded-full bg-[#b76e79] px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#9a5560]"
              >
                Book an appointment
              </a>
              <a
                href={`tel:${SALON.phoneTel}`}
                className="rounded-full border border-[#e0cec8] bg-white px-6 py-3 text-sm font-medium text-[#3a3033] transition-colors hover:border-[#b76e79] hover:text-[#b76e79]"
              >
                Call {SALON.phoneDisplay}
              </a>
            </div>
          </div>
          <PhotoFrame
            photo={HERO_PHOTO}
            priority
            className="aspect-[4/5] w-full"
          />
        </section>

        {/* Services */}
        <section id="services" className="border-t border-[#efe0da] bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <div className="max-w-xl">
              <h2
                className={`text-4xl font-semibold tracking-tight text-[#3a3033] ${serif}`}
              >
                Services
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#6b5f62]">
                A little something for every occasion.
              </p>
            </div>

            <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
              {SERVICE_CATEGORIES.map((cat) => (
                <div key={cat}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b76e79]">
                    {cat}
                  </h3>
                  <ul className="mt-4 divide-y divide-[#f3eae6]">
                    {SERVICES.filter((s) => s.category === cat).map((s) => (
                      <li key={s.id} className="flex gap-4 py-3.5">
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-medium text-[#3a3033]">
                            {s.name}
                          </p>
                          <p className="mt-0.5 text-[13px] leading-relaxed text-[#6b5f62]">
                            {s.desc}
                          </p>
                        </div>
                        <div className="flex-none text-right">
                          <p className="text-[15px] font-semibold text-[#3a3033]">
                            {formatPrice(s.price)}
                          </p>
                          <p className="mt-0.5 text-xs text-[#a3969a]">
                            {formatDuration(s.minutes)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-dashed border-[#d8bfc3] bg-[#f9eef0] p-5">
              <p className="text-[13px] leading-relaxed text-[#8a5560]">
                <span className="font-semibold">Note for Fancy Nails:</span> every
                price and every duration above is a placeholder — I guessed at
                typical Kingston rates so the page looks finished. Tell me the
                real ones and they change everywhere at once, including the times
                the booking page offers.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="border-t border-[#efe0da]">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2
                  className={`text-4xl font-semibold tracking-tight text-[#3a3033] ${serif}`}
                >
                  Our work
                </h2>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#6b5f62]">
                  Send over your favourite photos from Facebook or Instagram and
                  they drop straight into these spots.
                </p>
              </div>
              <a
                href="#book"
                className="text-sm font-medium text-[#b76e79] transition-colors hover:text-[#9a5560]"
              >
                Book your look →
              </a>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {GALLERY.slice(0, 6).map((photo, i) => (
                <PhotoFrame
                  key={i}
                  photo={photo}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="aspect-square"
                />
              ))}
              {GALLERY[6] && (
                <PhotoFrame
                  photo={GALLERY[6]}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="col-span-2 aspect-[2/1] md:col-span-2"
                />
              )}
            </div>
          </div>
        </section>

        {/* Booking */}
        <section id="book" className="border-t border-[#efe0da] bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-20">
            <div>
              <h2
                className={`text-4xl font-semibold tracking-tight text-[#3a3033] ${serif}`}
              >
                Book an appointment
              </h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#6b5f62]">
                Pick a service, a day, and a time that&apos;s actually free.
                Prefer to talk? Call{" "}
                <a
                  href={`tel:${SALON.phoneTel}`}
                  className="font-medium text-[#b76e79] hover:underline"
                >
                  {SALON.phoneDisplay}
                </a>
                .
              </p>

              <div className="mt-8 space-y-3 rounded-xl border border-[#f0e3dd] bg-[#fdfaf8] p-6">
                <p
                  className={`text-xl font-medium text-[#3a3033] ${serif}`}
                >
                  Walk-ins welcome
                </p>
                <p className="text-sm leading-relaxed text-[#6b5f62]">
                  Booking ahead is recommended for gel, full sets, and weekend
                  visits.
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-dashed border-[#d8bfc3] bg-[#f9eef0] p-5">
                <p className="text-[13px] leading-relaxed text-[#8a5560]">
                  <span className="font-semibold">This one is live.</span> Book
                  something and it goes into the salon&apos;s book for real —
                  then check{" "}
                  <a
                    href="/demo/fancynails/desk"
                    className="font-semibold underline underline-offset-2"
                  >
                    the front desk page
                  </a>{" "}
                  and it&apos;ll be sitting there.
                </p>
              </div>
            </div>

            <BookingFlow />
          </div>
        </section>

        {/* Visit */}
        <section id="visit" className="border-t border-[#efe0da]">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-20">
            <div>
              <h2
                className={`text-4xl font-semibold tracking-tight text-[#3a3033] ${serif}`}
              >
                Visit us
              </h2>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#b76e79]">
                    Location
                  </p>
                  <p className="mt-1 text-[15px] text-[#3a3033]">
                    {SALON.address}
                  </p>
                  <a
                    href={SALON.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-sm font-medium text-[#b76e79] hover:underline"
                  >
                    Get directions →
                  </a>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#b76e79]">
                    Phone
                  </p>
                  <a
                    href={`tel:${SALON.phoneTel}`}
                    className="mt-1 inline-block text-[15px] text-[#3a3033] hover:text-[#b76e79]"
                  >
                    {SALON.phoneDisplay}
                  </a>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#b76e79]">
                    Hours
                  </p>
                  <dl className="mt-2 space-y-1.5">
                    {HOURS_DISPLAY.map((h) => (
                      <div
                        key={h.day}
                        className="flex justify-between gap-6 text-sm"
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
              href={SALON.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <PhotoFrame
                photo={STOREFRONT_PHOTO}
                className="aspect-[4/3] w-full transition-shadow group-hover:shadow-md md:aspect-auto md:h-full"
              />
            </a>
          </div>
        </section>

        {/* What else can be set up */}
        <section className="border-t border-[#efe0da] bg-[#3a3033]">
          <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
            <p className="text-xs uppercase tracking-[0.2em] text-[#d8a9b0]">
              Later, if you want it
            </p>
            <h2
              className={`mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-[#f6ece9] md:text-4xl ${serif}`}
            >
              Things that can be added on top
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#b3a5a1]">
              None of this is needed to start. It&apos;s just what&apos;s possible
              once the bookings are in one place.
            </p>
            <ul className="mt-8 grid gap-x-10 gap-y-4 text-[15px] text-[#e7dcd8] sm:grid-cols-2">
              {[
                "A text reminder the day before, to cut the no-shows",
                "A nudge to past clients who haven't been in for a while",
                "Bookings copied into a calendar you already use",
                "A text to the salon the moment someone books",
                "Birthday and loyalty perks for regulars",
                "A review request after each visit",
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
          <div className="flex flex-wrap items-baseline gap-2">
            <span
              className={`text-xl font-semibold text-[#3a3033] ${serif}`}
            >
              {SALON.name}
            </span>
            <span className="text-xs text-[#a3969a]">{SALON.address}</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-[#6b5f62]">
            <a href={`tel:${SALON.phoneTel}`} className="hover:text-[#b76e79]">
              {SALON.phoneDisplay}
            </a>
            <a href="#book" className="hover:text-[#b76e79]">
              Book
            </a>
            <a href="/demo/fancynails/desk" className="hover:text-[#b76e79]">
              Front desk
            </a>
          </div>
        </div>
        <p className="pb-6 text-center text-xs text-[#c3b7ba]">
          Design demo · not the official {SALON.fullName} website
        </p>
      </footer>
    </div>
  );
}
