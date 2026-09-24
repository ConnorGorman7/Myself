/* ══════════════════════════════════════════════════════════════════════════
   Booking store for the Fancy Nails demo.

   Backed by the same Upstash Redis instance the /r review links already use, so
   a booking made on a phone shows up on the front-desk screen for real. Every
   key is namespaced `fnd:` so nothing here can touch the review-link counters.

   With no Redis env vars (local `npm run dev`) it falls back to an in-process
   Map, so the demo still works offline — it just won't share data between
   devices. The API reports which mode it's in.
   ══════════════════════════════════════════════════════════════════════════ */

import { Redis } from "@upstash/redis";
import {
  CAPACITY,
  HOURS,
  LEAD_TIME_MIN,
  SLOT_STEP_MIN,
  findService,
  BOOKABLE_SERVICES,
} from "./config";
import {
  addDays,
  dayOfWeek,
  isValidDate,
  nowMinutes,
  toHHMM,
  toMinutes,
  todayISO,
} from "./dates";

const PREFIX = "fnd:";

/* ─── Types ───────────────────────────────────────────────────────────────── */

export type BookingStatus = "booked" | "done" | "no-show" | "cancelled";

/** Where the appointment came from — the whole point of the pitch. */
export type BookingSource = "online" | "phone" | "walk-in";

export type Booking = {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM, 24-hour */
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
  /** True for the pre-filled example appointments, so a reset can tell them apart. */
  seeded?: boolean;
};

export type NewBooking = {
  date: string;
  start: string;
  serviceId: string;
  name: string;
  phone: string;
  notes?: string;
  source?: BookingSource;
};

/* ─── Backend ─────────────────────────────────────────────────────────────── */

/**
 * `Redis.fromEnv()` does NOT throw when the env vars are missing — it hands back
 * a client with an invalid URL that only fails once you call it. So check the
 * credentials ourselves before deciding we have a database.
 *
 * Vercel's Upstash integration sets the UPSTASH_* pair; the older KV integration
 * sets the KV_REST_API_* pair. Accept either.
 */
function connect(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
  if (!url.startsWith("http") || !token) return null;
  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

let redis: Redis | null = connect();

/** Local dev fallback: date → (id → booking). */
const memDays = new Map<string, Map<string, Booking>>();
const memInit = new Set<string>();

/**
 * If Redis goes down mid-demo, drop to the in-memory store rather than showing
 * an error to a client who's being pitched. Logged once, then it stays local for
 * the life of the instance.
 */
function degrade(err: unknown): void {
  if (!redis) return;
  redis = null;
  console.error(
    "[fancynails] Redis unavailable — falling back to the in-memory store",
    err
  );
}

export function getStorageMode(): "redis" | "memory" {
  return redis ? "redis" : "memory";
}

const dayKey = (date: string) => `${PREFIX}day:${date}`;
const initKey = (date: string) => `${PREFIX}init:${date}`;

function memRead(date: string): Booking[] {
  return [...(memDays.get(date)?.values() ?? [])];
}

async function readDayRaw(date: string): Promise<Booking[]> {
  if (redis) {
    try {
      const hash = await redis.hgetall<Record<string, unknown>>(dayKey(date));
      if (!hash) return [];
      // Upstash normally deserializes JSON for us, but tolerate raw strings too.
      return Object.values(hash)
        .map((v) => (typeof v === "string" ? safeParse(v) : (v as Booking)))
        .filter((b): b is Booking => !!b && typeof b === "object" && "id" in b);
    } catch (err) {
      degrade(err);
    }
  }
  return memRead(date);
}

function safeParse(s: string): Booking | null {
  try {
    return JSON.parse(s) as Booking;
  } catch {
    return null;
  }
}

function memWrite(b: Booking): void {
  if (!memDays.has(b.date)) memDays.set(b.date, new Map());
  memDays.get(b.date)!.set(b.id, b);
}

async function writeBooking(b: Booking): Promise<void> {
  if (redis) {
    try {
      await redis.hset(dayKey(b.date), { [b.id]: JSON.stringify(b) });
      return;
    } catch (err) {
      degrade(err);
    }
  }
  memWrite(b);
}

async function removeBooking(date: string, id: string): Promise<void> {
  if (redis) {
    try {
      await redis.hdel(dayKey(date), id);
      return;
    } catch (err) {
      degrade(err);
    }
  }
  memDays.get(date)?.delete(id);
}

/**
 * Claim the right to seed a date. Returns false if the date is already seeded, so
 * two simultaneous first-views can't both fill the same day.
 */
async function claimInit(date: string): Promise<boolean> {
  if (redis) {
    try {
      // Long TTL so the demo eventually tidies itself up without any maintenance.
      const won = await redis.set(initKey(date), 1, {
        nx: true,
        ex: 60 * 60 * 24 * 120,
      });
      return won === "OK";
    } catch (err) {
      degrade(err);
    }
  }
  if (memInit.has(date)) return false;
  memInit.add(date);
  return true;
}

/**
 * Cheap mutual exclusion per day so two people booking the same slot at the same
 * moment can't both win. Gives up after a few tries rather than failing the
 * booking outright — the capacity check still runs either way.
 */
async function withDayLock<T>(date: string, fn: () => Promise<T>): Promise<T> {
  if (!redis) return fn();
  const key = `${PREFIX}lock:${date}`;
  for (let attempt = 0; attempt < 8; attempt++) {
    let got: unknown = null;
    try {
      got = await redis.set(key, 1, { nx: true, px: 4000 });
    } catch (err) {
      degrade(err);
      return fn();
    }
    if (got === "OK") {
      try {
        return await fn();
      } finally {
        await redis?.del(key).catch(() => {});
      }
    }
    await sleep(60 + attempt * 40);
  }
  return fn();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ─── Time helpers (salon-local, not server-local) ────────────────────────── */

export {
  addDays,
  dayOfWeek,
  isValidDate,
  nowMinutes,
  toHHMM,
  toMinutes,
  todayISO,
} from "./dates";

export function openingHours(date: string) {
  return HOURS[dayOfWeek(date)] ?? null;
}

/* ─── Availability ────────────────────────────────────────────────────────── */

/** Appointments that actually occupy a chair. */
const isActive = (b: Booking) => b.status === "booked" || b.status === "done";

/**
 * How many chairs are busy at each point across [start, start+minutes).
 * Returns true only if a new appointment fits under CAPACITY the whole way.
 */
function fits(existing: Booking[], start: number, minutes: number): boolean {
  const end = start + minutes;
  for (let t = start; t < end; t += SLOT_STEP_MIN) {
    let busy = 0;
    for (const b of existing) {
      if (!isActive(b)) continue;
      const bs = toMinutes(b.start);
      if (t >= bs && t < bs + b.minutes) busy++;
    }
    if (busy >= CAPACITY) return false;
  }
  return true;
}

export type Slot = { start: string; available: boolean };

/** Every slot for a date and service, with a flag for whether it's takeable. */
export async function getAvailability(
  date: string,
  serviceId: string
): Promise<{ slots: Slot[]; closed: boolean }> {
  const service = findService(serviceId);
  const hours = openingHours(date);
  if (!service || !hours) return { slots: [], closed: true };

  const existing = await getDay(date);
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  const today = todayISO();
  const earliest = date === today ? nowMinutes() + LEAD_TIME_MIN : -Infinity;

  const slots: Slot[] = [];
  for (let t = open; t + service.minutes <= close; t += SLOT_STEP_MIN) {
    slots.push({
      start: toHHMM(t),
      available: t >= earliest && fits(existing, t, service.minutes),
    });
  }
  return { slots, closed: false };
}

/* ─── Reads ───────────────────────────────────────────────────────────────── */

/** All appointments for a date, chronological. Seeds example data on first touch. */
export async function getDay(date: string): Promise<Booking[]> {
  await seedDay(date);
  const all = await readDayRaw(date);
  return all.sort((a, b) => a.start.localeCompare(b.start));
}

export async function getRange(from: string, days: number) {
  const dates = Array.from({ length: days }, (_, i) => addDays(from, i));
  const results = await Promise.all(dates.map((d) => getDay(d)));
  return dates.map((date, i) => ({ date, bookings: results[i] }));
}

/* ─── Writes ──────────────────────────────────────────────────────────────── */

export type CreateResult =
  | { ok: true; booking: Booking }
  | { ok: false; error: string };

export async function createBooking(input: NewBooking): Promise<CreateResult> {
  const service = findService(input.serviceId);
  if (!service) return { ok: false, error: "That service doesn't exist." };
  if (!isValidDate(input.date)) return { ok: false, error: "Pick a valid date." };
  if (!/^\d{2}:\d{2}$/.test(input.start))
    return { ok: false, error: "Pick a valid time." };

  const name = input.name.trim();
  const phone = input.phone.trim();
  if (!name) return { ok: false, error: "A name is needed." };
  if (phone.replace(/\D/g, "").length < 7)
    return { ok: false, error: "A phone number is needed." };

  const hours = openingHours(input.date);
  if (!hours) return { ok: false, error: "The salon is closed that day." };

  const start = toMinutes(input.start);
  if (start < toMinutes(hours.open) || start + service.minutes > toMinutes(hours.close))
    return { ok: false, error: "That time is outside opening hours." };

  const source: BookingSource = input.source ?? "online";

  // Online customers can't book in the past; the front desk can (writing up a
  // walk-in that already happened is normal).
  if (source === "online") {
    const today = todayISO();
    if (input.date < today) return { ok: false, error: "That date has passed." };
    if (input.date === today && start < nowMinutes() + LEAD_TIME_MIN)
      return { ok: false, error: "That time has passed — please pick a later one." };
  }

  return withDayLock(input.date, async () => {
    const existing = await getDay(input.date);
    if (!fits(existing, start, service.minutes)) {
      return {
        ok: false,
        error: "That time just filled up. Please pick another.",
      } as CreateResult;
    }

    const booking: Booking = {
      id: makeId(),
      date: input.date,
      start: input.start,
      minutes: service.minutes,
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      name,
      phone,
      notes: (input.notes ?? "").trim().slice(0, 500),
      status: "booked",
      source,
      createdAt: new Date().toISOString(),
    };
    await writeBooking(booking);
    return { ok: true, booking } as CreateResult;
  });
}

export async function updateBooking(
  date: string,
  id: string,
  status: BookingStatus
): Promise<Booking | null> {
  const all = await readDayRaw(date);
  const booking = all.find((b) => b.id === id);
  if (!booking) return null;
  const updated = { ...booking, status };
  await writeBooking(updated);
  return updated;
}

export async function deleteBooking(date: string, id: string): Promise<boolean> {
  const all = await readDayRaw(date);
  if (!all.some((b) => b.id === id)) return false;
  await removeBooking(date, id);
  return true;
}

/** Wipe every demo booking and let the example days regenerate on next view. */
export async function resetDemo(): Promise<number> {
  let cleared = 0;
  if (redis) {
    try {
      const keys = await redis.keys(`${PREFIX}*`);
      if (keys.length) await redis.del(...keys);
      cleared = keys.length;
    } catch (err) {
      degrade(err);
    }
  }
  cleared += [...memDays.values()].reduce((sum, m) => sum + m.size, 0);
  memDays.clear();
  memInit.clear();
  return cleared;
}

/* ─── Confirmation codes ──────────────────────────────────────────────────── */

const ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no look-alikes

function makeId(): string {
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)];
  }
  return out;
}

/* ─── Example data ────────────────────────────────────────────────────────── */

/**
 * The front-desk book must never look empty — an empty screen proves nothing.
 * Each date gets a deterministic set of example appointments the first time it's
 * viewed, spread across online / phone / walk-in so the "everything in one list"
 * point makes itself.
 */

const SEED_NAMES = [
  "Amanda R.", "Priya S.", "Jess Tremblay", "Nicole B.", "Hannah Côté",
  "Maria L.", "Sam Okafor", "Danielle W.", "Kaitlyn M.", "Fatima A.",
  "Rachel Dube", "Chloe N.", "Steph Laval", "Bianca T.", "Leah Bennett",
  "Morgan K.", "Alyssa P.", "Tanya G.", "Emily Rose", "Nadia H.",
  "Carly M.", "Joanne P.", "Simran K.", "Brooke L.", "Val Chartrand",
  "Erin Doyle", "Mei Lin", "Tara B.", "Shannon O.", "Gabby R.",
  "Renée L.", "Olivia S.", "Paige W.", "Camille F.", "Zara N.",
];

const SEED_NOTES = [
  "", "", "", "", "",
  "Regular — likes the square shape",
  "Bringing her daughter, might add a polish change",
  "Allergic to the pink gel, use the clear",
  "Asked for the same colour as last time",
  "Running from work, might be 5 min late",
  "Wants to talk about a full set next visit",
];

/** Mostly phone and online, the odd walk-in — the point being that all three land here. */
const SEED_SOURCES: BookingSource[] = [
  "phone", "phone", "phone", "online", "online", "online", "online", "walk-in",
];

/** Deterministic PRNG so a given date always seeds the same way. */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Popular services show up more often than a flat random pick would give. */
const SEED_WEIGHTS: Record<string, number> = {
  "mani-gel": 5,
  "full-set": 4,
  fill: 4,
  "pedi-spa": 3,
  "mani-classic": 3,
  "pedi-classic": 3,
  "mani-pedi": 2,
  "polish-change": 2,
  "wax-brow": 2,
  "soak-off": 1,
  "wax-lip-chin": 1,
  "wax-face": 1,
  "wax-leg-full": 1,
  "wax-underarm": 1,
};

const SEED_POOL = BOOKABLE_SERVICES.flatMap((s) =>
  Array<typeof s>(SEED_WEIGHTS[s.id] ?? 1).fill(s)
);

/** How full a day looks, by weekday. Fri/Sat are the busy ones. */
const BUSYNESS = [0.45, 0.62, 0.6, 0.65, 0.7, 0.85, 0.9];

async function seedDay(date: string): Promise<void> {
  if (!(await claimInit(date))) return;

  const hours = openingHours(date);
  if (!hours) return;

  const today = todayISO();
  // Only populate a window around today. Far-off dates stay genuinely open.
  if (date < addDays(today, -14) || date > addDays(today, 21)) return;

  const rand = rng(date);
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  const busyness = BUSYNESS[dayOfWeek(date)];

  const placed: Booking[] = [];
  // One appointment per person per day — a repeated name reads as fake data.
  const usedNames = new Set<string>();
  const takeName = (): string => {
    for (let i = 0; i < 40; i++) {
      const candidate = SEED_NAMES[Math.floor(rand() * SEED_NAMES.length)];
      if (!usedNames.has(candidate)) {
        usedNames.add(candidate);
        return candidate;
      }
    }
    return SEED_NAMES[Math.floor(rand() * SEED_NAMES.length)];
  };

  /* Walk each chair forward through the day rather than scattering appointments
     at random times — a real book fills in runs, with gaps between clients, and
     the later chairs quieter than the first. */
  for (let chair = 0; chair < CAPACITY; chair++) {
    const chairBusyness = busyness * Math.pow(0.78, chair);
    let t = open + Math.floor(rand() * 3) * SLOT_STEP_MIN;

    while (t < close) {
      if (rand() > chairBusyness) {
        t += SLOT_STEP_MIN * (1 + Math.floor(rand() * 3));
        continue;
      }

      const service = SEED_POOL[Math.floor(rand() * SEED_POOL.length)];
      if (t + service.minutes > close) break;
      if (!fits(placed, t, service.minutes)) {
        t += SLOT_STEP_MIN;
        continue;
      }

      const startsInPast =
        date < today || (date === today && t + service.minutes < nowMinutes());
      // The odd no-show in the past is the whole reason reminders get sold.
      const status: BookingStatus = startsInPast
        ? rand() < 0.1
          ? "no-show"
          : "done"
        : "booked";

      placed.push({
        id: makeId(),
        date,
        start: toHHMM(t),
        minutes: service.minutes,
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        name: takeName(),
        phone: `613-${String(200 + Math.floor(rand() * 799))}-${String(
          1000 + Math.floor(rand() * 8999)
        )}`,
        notes: SEED_NOTES[Math.floor(rand() * SEED_NOTES.length)],
        status,
        source: SEED_SOURCES[Math.floor(rand() * SEED_SOURCES.length)],
        createdAt: new Date().toISOString(),
        seeded: true,
      });

      // Turnaround between clients.
      t += service.minutes + SLOT_STEP_MIN * Math.floor(rand() * 2);
    }
  }

  await Promise.all(placed.map(writeBooking));
}
