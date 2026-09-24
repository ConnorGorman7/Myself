/* Date helpers shared by the server store and the browser.

   Everything is anchored to the salon's own timezone rather than the server's or
   the visitor's, so "today" means today in Kingston no matter who's looking. */

export const TZ = "America/Toronto";

const isoFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const clockFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Today in Kingston, as YYYY-MM-DD. */
export function todayISO(): string {
  return isoFormatter.format(new Date());
}

/** Minutes since midnight, right now, in Kingston. */
export function nowMinutes(): number {
  const [h, m] = clockFormatter.format(new Date()).split(":").map(Number);
  return h * 60 + m;
}

export const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const toHHMM = (mins: number): string =>
  `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

/** Day of week (0 = Sunday) from a date string, with no timezone drift. */
export function dayOfWeek(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Shift a YYYY-MM-DD string by whole days. */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(
    dt.getUTCDate()
  ).padStart(2, "0")}`;
}

export function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date));
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2026-09-23" → "Wednesday, September 23" */
export function formatDateLong(date: string): string {
  const [, m, d] = date.split("-").map(Number);
  return `${WEEKDAYS[dayOfWeek(date)]}, ${MONTHS[m - 1]} ${d}`;
}

/** "2026-09-23" → "Wed 23 Sep" */
export function formatDateShort(date: string): string {
  const [, m, d] = date.split("-").map(Number);
  return `${WEEKDAYS_SHORT[dayOfWeek(date)]} ${d} ${MONTHS_SHORT[m - 1]}`;
}

export function weekdayShort(date: string): string {
  return WEEKDAYS_SHORT[dayOfWeek(date)];
}

export function dayOfMonth(date: string): number {
  return Number(date.split("-")[2]);
}

export function monthShort(date: string): string {
  return MONTHS_SHORT[Number(date.split("-")[1]) - 1];
}

/** "Today" / "Tomorrow" / "Yesterday" where it applies, otherwise the long form. */
export function relativeDateLabel(date: string, today: string): string {
  if (date === today) return "Today";
  if (date === addDays(today, 1)) return "Tomorrow";
  if (date === addDays(today, -1)) return "Yesterday";
  return formatDateLong(date);
}
