import { NextResponse } from "next/server";
import {
  createBooking,
  getDay,
  getRange,
  isValidDate,
  getStorageMode,
  todayISO,
  type BookingSource,
} from "@/lib/fancynails/store";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store, max-age=0" };

/**
 * GET /api/demo/fancynails/bookings?date=YYYY-MM-DD[&days=n]
 * One day by default; `days` returns a consecutive range for the week strip.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? todayISO();
  const daysParam = Number(url.searchParams.get("days") ?? "1");

  if (!isValidDate(date)) {
    return NextResponse.json(
      { error: "Invalid date" },
      { status: 400, headers: noStore }
    );
  }

  const days = Number.isFinite(daysParam)
    ? Math.min(Math.max(Math.trunc(daysParam), 1), 14)
    : 1;

  if (days === 1) {
    const bookings = await getDay(date);
    return NextResponse.json(
      { date, bookings, today: todayISO(), storageMode: getStorageMode() },
      { headers: noStore }
    );
  }

  const range = await getRange(date, days);
  return NextResponse.json(
    { from: date, days, range, today: todayISO(), storageMode: getStorageMode() },
    { headers: noStore }
  );
}

/** POST /api/demo/fancynails/bookings — create an appointment. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Expected JSON" },
      { status: 400, headers: noStore }
    );
  }

  const b = body as Record<string, unknown>;
  const source = b.source as string | undefined;
  const allowed: BookingSource[] = ["online", "phone", "walk-in"];

  const result = await createBooking({
    date: String(b.date ?? ""),
    start: String(b.start ?? ""),
    serviceId: String(b.serviceId ?? ""),
    name: String(b.name ?? ""),
    phone: String(b.phone ?? ""),
    notes: b.notes == null ? "" : String(b.notes),
    source: allowed.includes(source as BookingSource)
      ? (source as BookingSource)
      : "online",
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: 409, headers: noStore }
    );
  }

  return NextResponse.json(
    { booking: result.booking },
    { status: 201, headers: noStore }
  );
}
