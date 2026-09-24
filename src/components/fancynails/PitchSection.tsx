import { SALON, TRIAL, formatTime } from "@/lib/fancynails/config";
import { C, Check, serif } from "./shared";

/* ══════════════════════════════════════════════════════════════════════════
   The pitch, written to be read with nobody standing there explaining it.

   The reader is the owner: she runs the place on paper, likes seeing the day
   in front of her, and has been burned by an online platform she has to
   remember to go and check. So the order is deliberate —

     1. reassure before proposing  (her book stays)
     2. name her own frictions     (agreement before argument)
     3. separate what changes from what doesn't  (the real objection)
     4. hand her something to press  (proof beats adjectives)
     5. make saying yes cost nothing, and saying no cost nothing

   No invented statistics and no testimonials. Every claim here is either a
   description of the software or a promise Connor can keep.
   ══════════════════════════════════════════════════════════════════════════ */

const FRICTIONS = [
  {
    title: "The phone rings mid-set",
    body: "Your hands are in someone's nails. You either stop, or you let it ring and hope they call back.",
  },
  {
    title: "Two names, one slot",
    body: "It gets written in twice and nobody finds out until they're both standing at the counter.",
  },
  {
    title: "The online bookings hide",
    body: "They sit in a platform someone has to remember to open. If nobody checks it, nobody knows.",
  },
  {
    title: "“What does tomorrow look like?”",
    body: "There's no quick answer. Somebody has to go find the book and read it out.",
  },
];

const STAYS_THE_SAME = [
  "Your paper book. Keep writing in it exactly like you do now.",
  "Walk-ins. They still just walk in.",
  "The phone. You answer it the same way — you just write it here instead of, or as well as, the book.",
  "Your prices, your hours, your services, who does what. All set to whatever you say.",
  "No new device. It opens on the phone or computer you already have.",
];

const WHATS_NEW = [
  "One page with every appointment on it — counter, phone, and online, in the same list.",
  "A printed sheet each morning, in the same order you'd have written it yourself.",
  "Customers booking themselves at 11pm, without ringing you.",
  "It won't let two people take the same time. It checks before it accepts.",
  "Yesterday's page is still there next month, without a shelf full of books.",
];

const OFFER = [
  "No card. No contract. Nothing to cancel.",
  "Nothing to install — it's a web page, like this one.",
  `Your paper book keeps running the whole ${TRIAL.days} days, side by side. Nothing gets moved off it.`,
  "Connor sets it all up. You don't type anything in.",
  `After the ${TRIAL.days} days we sit down and talk numbers — once you actually know whether it's worth anything to you.`,
  "If it's a no, it's a no, and you've spent nothing.",
];

/** A fixed sample of the front-desk sheet, so the cover always reads right. */
const PREVIEW_ROWS = [
  { time: "09:30", name: "Amanda R.", service: "Gel manicure", source: "phone" },
  { time: "10:15", name: "Priya S.", service: "Acrylic full set", source: "online" },
  { time: "11:00", name: "Jess Tremblay", service: "Spa pedicure", source: "walk-in" },
  { time: "11:45", name: "Nicole B.", service: "Eyebrow wax", source: "phone" },
  { time: "13:00", name: "Hannah Côté", service: "Acrylic fill", source: "online" },
];

const SOURCE_STYLE: Record<string, string> = {
  online: "bg-[#eef3f0] text-[#4a6b5b]",
  phone: "bg-[#f9eef0] text-[#8a5560]",
  "walk-in": "bg-[#f6efe3] text-[#7a6440]",
};

export function PitchSection() {
  return (
    <div className="border-b-4 border-[#3a3033] bg-[#fbf7f4]">
      {/* ── Cover ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-10 md:pb-20 md:pt-16">
        <p className="text-xs uppercase tracking-[0.22em] text-[#b76e79]">
          A proposal for {SALON.fullName}
        </p>
        <div className="mt-6 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <h1
              className={`text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-[#3a3033] sm:text-6xl ${serif}`}
            >
              Keep your book.
              <br />
              Stop chasing the rest.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[#6b5f62]">
              An appointment can reach you three ways — at the counter, over the
              phone, or through the online platform — and it lands somewhere
              different each time. This puts all three in{" "}
              <strong className="font-semibold text-[#3a3033]">one list</strong>{" "}
              you can print every morning.
            </p>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[#6b5f62]">
              It&apos;s already built. That&apos;s your address, your hours, your
              services — not a template. Everything on this page works right now,
              and you can have it{" "}
              <strong className="font-semibold text-[#3a3033]">
                free for {TRIAL.days} days
              </strong>
              .
            </p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {[
                `${TRIAL.days} days free`,
                "No card, no contract",
                "Nothing to install",
                "Your paper book stays",
              ].map((chip) => (
                <li
                  key={chip}
                  className="flex items-center gap-1.5 rounded-full border border-[#e3d2cc] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#6b5f62]"
                >
                  <Check className="h-3.5 w-3.5 text-[#b76e79]" />
                  {chip}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#try-it"
                className="rounded-full bg-[#b76e79] px-6 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#9a5560]"
              >
                Try it — takes two minutes
              </a>
              <a
                href="/demo/fancynails/desk"
                className="rounded-full border border-[#dcc8c2] bg-white px-6 py-3.5 text-center text-sm font-semibold text-[#3a3033] transition-colors hover:border-[#b76e79] hover:text-[#b76e79]"
              >
                Open the front desk book →
              </a>
            </div>
          </div>

          {/* Sample day sheet — the thing being sold, shown rather than described */}
          <div className="rounded-2xl border border-[#e7d8d2] bg-white p-5 shadow-[0_18px_40px_-28px_rgba(58,48,51,0.5)] sm:p-6">
            <div className="flex items-baseline justify-between border-b border-[#f0e3dd] pb-3">
              <p className={`text-2xl font-semibold text-[#3a3033] ${serif}`}>
                Today at a glance
              </p>
              <span className="text-xs uppercase tracking-[0.15em] text-[#b76e79]">
                5 in
              </span>
            </div>
            <ul className="mt-1 divide-y divide-[#f5ece8]">
              {PREVIEW_ROWS.map((r) => (
                <li key={r.time} className="flex items-center gap-3 py-3">
                  <span className="w-[4.5rem] flex-none text-sm font-semibold tabular-nums text-[#3a3033]">
                    {formatTime(r.time)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[#3a3033]">
                      {r.name}
                    </span>
                    <span className="block truncate text-xs text-[#6b5f62]">
                      {r.service}
                    </span>
                  </span>
                  <span
                    className={`flex-none rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
                      SOURCE_STYLE[r.source]
                    }`}
                  >
                    {r.source}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-[#f0e3dd] pt-4 text-[13px] leading-relaxed text-[#6b5f62]">
              Three different ways in. One list out — and a{" "}
              <strong className="font-semibold text-[#3a3033]">print button</strong>{" "}
              so it can sit at the desk on paper, like always.
            </p>
          </div>
        </div>
      </section>

      {/* ── Frictions: agreement before argument ──────────────────────── */}
      <section className="border-t border-[#efe0da] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-18">
          <h2
            className={`text-3xl font-semibold tracking-tight text-[#3a3033] sm:text-4xl ${serif}`}
          >
            Any of this sound familiar?
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FRICTIONS.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-[#f0e3dd] bg-[#fdfaf8] p-5"
              >
                <p className="text-[15px] font-semibold text-[#3a3033]">
                  {f.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6b5f62]">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-[#6b5f62]">
            None of that is a paper problem. Paper is fine — it&apos;s having{" "}
            <em>three separate places</em>{" "}
            and no single one that&apos;s always right.
          </p>
        </div>
      </section>

      {/* ── Stays the same / what's new ───────────────────────────────── */}
      <section className="border-t border-[#efe0da]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-18">
          <h2
            className={`max-w-2xl text-3xl font-semibold tracking-tight text-[#3a3033] sm:text-4xl ${serif}`}
          >
            The important part: almost nothing changes
          </h2>
          <div className="mt-9 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#e2ded5] bg-[#f7f6f1] p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a7a6a]">
                Stays exactly as it is
              </p>
              <ul className="mt-5 space-y-3.5">
                {STAYS_THE_SAME.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-[#4a4440]"
                  >
                    <span
                      className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-[#9a9a86]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#e0cdc7] bg-[#fdf4f2] p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b76e79]">
                What you get on top
              </p>
              <ul className="mt-5 space-y-3.5">
                {WHATS_NEW.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-[#463a3d]"
                  >
                    <Check className="mt-[3px] h-4 w-4 flex-none text-[#b76e79]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-[15px] leading-relaxed text-[#6b5f62]">
            You are not being asked to give up the book. You&apos;re being asked to
            let something else write in it too.
          </p>
        </div>
      </section>

      {/* ── Try it: the proof, self-guided ────────────────────────────── */}
      <section id="try-it" className="border-t border-[#efe0da] bg-[#3a3033]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-18">
          <p className="text-xs uppercase tracking-[0.22em] text-[#d8a9b0]">
            Don&apos;t take my word for it
          </p>
          <h2
            className={`mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-[#f6ece9] sm:text-4xl ${serif}`}
          >
            Try it yourself, right now, in this page
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#cfc1bd]">
            This is a working system, not pictures of one. Two steps, about two
            minutes.
          </p>

          <ol className="mt-9 grid gap-4 md:grid-cols-2">
            <li className="rounded-2xl border border-[#54474b] bg-[#443a3d] p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b76e79] text-sm font-semibold text-white">
                1
              </span>
              <p className={`mt-4 text-2xl font-semibold text-[#f6ece9] ${serif}`}>
                Book an appointment
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#cfc1bd]">
                Go down to the booking section and book yourself in, the way a
                customer would. Pick anything — it&apos;s a demo, use a fake name.
              </p>
              <a
                href="#book"
                className="mt-5 inline-block rounded-full bg-[#b76e79] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9a5560]"
              >
                Take me to booking ↓
              </a>
            </li>
            <li className="rounded-2xl border border-[#54474b] bg-[#443a3d] p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b76e79] text-sm font-semibold text-white">
                2
              </span>
              <p className={`mt-4 text-2xl font-semibold text-[#f6ece9] ${serif}`}>
                Watch it land in the book
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#cfc1bd]">
                Open the front desk book and your appointment is sitting there,
                in order, with everything else. Nobody had to go and check
                anything.
              </p>
              <a
                href="/demo/fancynails/desk"
                className="mt-5 inline-block rounded-full border border-[#8a7377] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#f6ece9] transition-colors hover:border-[#f6ece9]"
              >
                Open the book →
              </a>
            </li>
          </ol>

          <p className="mt-7 max-w-2xl text-sm leading-relaxed text-[#b3a5a1]">
            Best bit: book it on your phone while the book is open on a computer.
            It appears on both. When you&apos;re done playing, the book has a{" "}
            <strong className="font-semibold text-[#f6ece9]">
              Start fresh
            </strong>{" "}
            button that wipes everything you added.
          </p>
        </div>
      </section>

      {/* ── The offer ─────────────────────────────────────────────────── */}
      <section className="border-t border-[#efe0da] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-18">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#b76e79]">
                The offer
              </p>
              <p
                className={`mt-4 text-6xl font-semibold leading-none tracking-tight text-[#3a3033] sm:text-7xl ${serif}`}
              >
                {TRIAL.days} days
              </p>
              <p
                className={`mt-2 text-5xl font-semibold leading-none tracking-tight text-[#b76e79] sm:text-6xl ${serif}`}
              >
                {TRIAL.price}
              </p>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-[#6b5f62]">
                Use it properly for a month — real customers, real bookings —
                with the paper book still going beside it. Then decide.
              </p>
            </div>

            <div className="rounded-2xl border border-[#f0e3dd] bg-[#fdfaf8] p-6 sm:p-8">
              <ul className="space-y-4">
                {OFFER.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-[#463a3d]"
                  >
                    <Check className="mt-[3px] h-4 w-4 flex-none text-[#b76e79]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 rounded-xl border border-[#e6d2b8] bg-[#fbf3e6] p-5">
                <p className="text-sm font-semibold text-[#6f5a31]">
                  What happens if you just stop using it?
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#7a6849]">
                  Nothing. The page sits there. Your book is still your book, and
                  the phone still rings. There is no version of this where you end
                  up worse off than today.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-[#f0e3dd] bg-[#fdfaf8] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className={`text-2xl font-semibold text-[#3a3033] ${serif}`}>
                Questions, or want something changed?
              </p>
              <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-[#6b5f62]">
                Prices, times, services, hours, the photos, the wording — all of
                it is yours to set. Say what you want different and it gets
                changed.
              </p>
            </div>
            <a
              href="mailto:connorgorman@live.ca?subject=Fancy%20Nails%20booking%20page"
              className="flex-none rounded-full bg-[#3a3033] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#241d1f]"
            >
              Get in touch
            </a>
          </div>
        </div>
      </section>

      {/* ── Divider into the customer-facing site ─────────────────────── */}
      <section className="bg-[#fbf7f4]">
        <div className="mx-auto max-w-6xl px-5 py-12 text-center md:py-16">
          <p className="text-xs uppercase tracking-[0.22em] text-[#b76e79]">
            Below this line
          </p>
          <h2
            className={`mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-[#3a3033] sm:text-4xl ${serif}`}
          >
            The customer&apos;s side
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#6b5f62]">
            Everything from here down is the actual website your customers would
            use. Have a scroll, then book yourself in.
          </p>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.rose}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mt-8 h-7 w-7"
            aria-hidden="true"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>
    </div>
  );
}
