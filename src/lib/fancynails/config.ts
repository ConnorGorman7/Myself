/* ══════════════════════════════════════════════════════════════════════════
   FANCY NAILS DEMO — THE ONLY FILE YOU NEED TO EDIT

   Everything the salon might want changed lives here: services, how long each
   one takes, prices, hours, how many people can be in the chairs at once, and
   the photo captions. Change a number here and it updates the customer booking
   flow, the availability math, and the front-desk book all at once.

   Anything marked ⚠️ CONFIRM is a plausible guess, not something the salon told
   us. Ask them, then fix it here.
   ══════════════════════════════════════════════════════════════════════════ */

/* ─── The salon ───────────────────────────────────────────────────────────── */

export const SALON = {
  name: "Fancy Nails",
  fullName: "Fancy Nails and Beauty Supplies",
  tagline: "Nails & Waxing · Downtown Kingston",
  phoneDisplay: "613-766-0877",
  phoneTel: "6137660877",
  address: "255 Bagot St Unit A, Kingston, ON K7L 3G4",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=255+Bagot+St+Unit+A+Kingston+ON+K7L+3G4",
};

/* ─── The trial offer ─────────────────────────────────────────────────────── */

export const TRIAL = {
  days: 30,
  /** Shown as the price during the trial. */
  price: "$0",
};

/* ─── Chairs ──────────────────────────────────────────────────────────────── */

/**
 * ⚠️ CONFIRM — how many clients can be worked on at the same time.
 * This is the single most important number here: it's what decides whether a
 * time slot shows as available, and it's what stops the system double-booking.
 * Set it to the number of techs normally on the floor.
 */
export const CAPACITY = 3;

/** Booking slots are offered on this grid, in minutes. 15 or 30 both read fine. */
export const SLOT_STEP_MIN = 15;

/** Don't offer a slot starting sooner than this many minutes from now. */
export const LEAD_TIME_MIN = 60;

/** How many days ahead customers can book. */
export const BOOKING_WINDOW_DAYS = 30;

/* ─── Hours ───────────────────────────────────────────────────────────────── */

/**
 * ⚠️ CONFIRM — opening hours, 24h "HH:MM". `null` means closed that day.
 * Index 0 = Sunday, 6 = Saturday.
 */
export const HOURS: ({ open: string; close: string } | null)[] = [
  { open: "11:00", close: "17:00" }, // Sun
  { open: "09:30", close: "19:30" }, // Mon
  { open: "09:30", close: "19:30" }, // Tue
  { open: "09:30", close: "19:30" }, // Wed
  { open: "09:30", close: "19:30" }, // Thu
  { open: "09:30", close: "19:30" }, // Fri
  { open: "09:30", close: "18:00" }, // Sat
];

/** Human-readable version for the website. Keep in step with HOURS above. */
export const HOURS_DISPLAY = [
  { day: "Mon – Fri", time: "9:30 AM – 7:30 PM" },
  { day: "Saturday", time: "9:30 AM – 6:00 PM" },
  { day: "Sunday", time: "11:00 AM – 5:00 PM" },
];

/* ─── Services ────────────────────────────────────────────────────────────── */

export type ServiceCategory = "Nails" | "Pedicures" | "Waxing" | "Add-ons";

export type Service = {
  id: string;
  name: string;
  category: ServiceCategory;
  /** ⚠️ CONFIRM — minutes in the chair. Drives every available time shown. */
  minutes: number;
  /** ⚠️ CONFIRM — price in CAD. `null` renders as "ask" instead of a number. */
  price: number | null;
  desc: string;
  /** Add-ons are booked alongside another service, not on their own. */
  addOnOnly?: boolean;
};

/**
 * ⚠️ CONFIRM — every duration and price below is a placeholder based on typical
 * Kingston salon rates. The page tells customers these are examples, so nothing
 * breaks if they're off — but get the real ones before the trial starts.
 */
export const SERVICES: Service[] = [
  // Nails
  {
    id: "mani-classic",
    name: "Classic manicure",
    category: "Nails",
    minutes: 30,
    price: 30,
    desc: "Shape, cuticle care, buff, and a regular polish finish.",
  },
  {
    id: "mani-gel",
    name: "Gel manicure",
    category: "Nails",
    minutes: 50,
    price: 50,
    desc: "Long-wearing gel colour that stays glossy for weeks.",
  },
  {
    id: "full-set",
    name: "Acrylic full set",
    category: "Nails",
    minutes: 80,
    price: 65,
    desc: "A brand new set, built to the length and shape you want.",
  },
  {
    id: "fill",
    name: "Acrylic fill",
    category: "Nails",
    minutes: 55,
    price: 50,
    desc: "Refresh an existing set — regrowth filled, shape rebalanced.",
  },
  {
    id: "polish-change",
    name: "Polish change",
    category: "Nails",
    minutes: 20,
    price: 20,
    desc: "Quick colour swap, no full manicure needed.",
  },
  {
    id: "soak-off",
    name: "Soak-off / removal",
    category: "Nails",
    minutes: 25,
    price: 15,
    desc: "Gentle removal of gel or acrylic with a nail-health buff.",
  },

  // Pedicures
  {
    id: "pedi-classic",
    name: "Classic pedicure",
    category: "Pedicures",
    minutes: 45,
    price: 45,
    desc: "Soak, shape, cuticle care, and polish.",
  },
  {
    id: "pedi-spa",
    name: "Spa pedicure",
    category: "Pedicures",
    minutes: 60,
    price: 60,
    desc: "Everything in the classic, plus scrub, mask, and a longer massage.",
  },
  {
    id: "mani-pedi",
    name: "Manicure + pedicure",
    category: "Pedicures",
    minutes: 90,
    price: 75,
    desc: "The full set-down. Hands and feet, back to back.",
  },

  // Waxing
  {
    id: "wax-brow",
    name: "Eyebrow wax",
    category: "Waxing",
    minutes: 15,
    price: 15,
    desc: "Clean, shaped brows with a tidy finish.",
  },
  {
    id: "wax-lip-chin",
    name: "Lip or chin wax",
    category: "Waxing",
    minutes: 10,
    price: 10,
    desc: "Fast, gentle, and precise.",
  },
  {
    id: "wax-face",
    name: "Full face wax",
    category: "Waxing",
    minutes: 30,
    price: 40,
    desc: "Brows, lip, chin, and cheeks in one sitting.",
  },
  {
    id: "wax-leg-full",
    name: "Full leg wax",
    category: "Waxing",
    minutes: 45,
    price: 60,
    desc: "Ankle to thigh, smooth for weeks.",
  },
  {
    id: "wax-underarm",
    name: "Underarm wax",
    category: "Waxing",
    minutes: 15,
    price: 20,
    desc: "Quick, thorough, and easy to add to any visit.",
  },

  // Add-ons
  {
    id: "addon-art",
    name: "Nail art",
    category: "Add-ons",
    minutes: 20,
    price: null,
    desc: "French, chrome, ombré, or freehand — priced per design.",
    addOnOnly: true,
  },
  {
    id: "addon-paraffin",
    name: "Paraffin dip",
    category: "Add-ons",
    minutes: 15,
    price: 15,
    desc: "Warm wax treatment for soft hands or feet.",
    addOnOnly: true,
  },
  {
    id: "addon-repair",
    name: "Nail repair",
    category: "Add-ons",
    minutes: 15,
    price: 8,
    desc: "One broken nail rebuilt and matched to the rest.",
    addOnOnly: true,
  },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Nails",
  "Pedicures",
  "Waxing",
  "Add-ons",
];

export function findService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

/** Services a customer can book as the main appointment. */
export const BOOKABLE_SERVICES = SERVICES.filter((s) => !s.addOnOnly);

/* ─── Photos ──────────────────────────────────────────────────────────────── */

/**
 * Drop real photos into /public/demo/fancynails/ and set `src` to e.g.
 * "/demo/fancynails/hero.jpg". While `src` is null a labelled placeholder
 * renders in its place, so the layout is already correct.
 */
export type Photo = { src: string | null; label: string; alt: string };

export const HERO_PHOTO: Photo = {
  src: null,
  label: "Hero photo — a favourite set, or the studio",
  alt: "Nail work at Fancy Nails in Kingston",
};

export const GALLERY: Photo[] = [
  { src: null, label: "Nail photo 1", alt: "Nail design by Fancy Nails" },
  { src: null, label: "Nail photo 2", alt: "Nail design by Fancy Nails" },
  { src: null, label: "Nail photo 3", alt: "Nail design by Fancy Nails" },
  { src: null, label: "Nail photo 4", alt: "Nail design by Fancy Nails" },
  { src: null, label: "Nail photo 5", alt: "Nail design by Fancy Nails" },
  { src: null, label: "Nail photo 6", alt: "Nail design by Fancy Nails" },
  { src: null, label: "Nail photo 7 — wide", alt: "Nail design by Fancy Nails" },
];

export const STOREFRONT_PHOTO: Photo = {
  src: null,
  label: "Storefront photo",
  alt: "Fancy Nails storefront on Bagot St, Kingston",
};

/* ─── Formatting helpers ──────────────────────────────────────────────────── */

export function formatPrice(price: number | null): string {
  return price === null ? "ask" : `$${price}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

/** "14:30" → "2:30 PM" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}
