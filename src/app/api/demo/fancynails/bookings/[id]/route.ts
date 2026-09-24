import { NextResponse } from "next/server";
import {
  deleteBooking,
  isValidDate,
  updateBooking,
  type BookingStatus,
} from "@/lib/fancynails/store";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store, max-age=0" };

/**
 * Bookings live in a per-day bucket, so every write needs the date alongside the
 * id: PATCH|DELETE /api/demo/fancynails/bookings/<id>?date=YYYY-MM-DD
 */
function readDate(request: Request): string | null {
  const date = new URL(request.url).searchParams.get("date");
  return date && isValidDate(date) ? date : null;
}

/** PATCH — mark an appointment done / no-show / cancelled, or put it back. */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const date = readDate(request);
  if (!date) {
    return NextResponse.json(
      { error: "A valid ?date= is required" },
      { status: 400, headers: noStore }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Expected JSON" },
      { status: 400, headers: noStore }
    );
  }

  const status = (body as Record<string, unknown>).status;
  const allowed: BookingStatus[] = ["booked", "done", "no-show", "cancelled"];
  if (!allowed.includes(status as BookingStatus)) {
    return NextResponse.json(
      { error: `status must be one of ${allowed.join(", ")}` },
      { status: 400, headers: noStore }
    );
  }

  const updated = await updateBooking(date, id, status as BookingStatus);
  if (!updated) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404, headers: noStore }
    );
  }
  return NextResponse.json({ booking: updated }, { headers: noStore });
}

/** DELETE — remove an appointment from the book entirely. */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const date = readDate(request);
  if (!date) {
    return NextResponse.json(
      { error: "A valid ?date= is required" },
      { status: 400, headers: noStore }
    );
  }

  const removed = await deleteBooking(date, id);
  if (!removed) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404, headers: noStore }
    );
  }
  return NextResponse.json({ ok: true }, { headers: noStore });
}
