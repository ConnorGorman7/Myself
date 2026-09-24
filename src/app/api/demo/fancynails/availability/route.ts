import { NextResponse } from "next/server";
import {
  getAvailability,
  isValidDate,
  openingHours,
  todayISO,
} from "@/lib/fancynails/store";
import { findService } from "@/lib/fancynails/config";

export const dynamic = "force-dynamic";

/**
 * GET /api/demo/fancynails/availability?date=YYYY-MM-DD&serviceId=...
 * Real availability: opening hours minus what's already in the book, checked
 * against how many chairs the salon has.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? todayISO();
  const serviceId = url.searchParams.get("serviceId") ?? "";
  const noStore = { "Cache-Control": "no-store, max-age=0" };

  if (!isValidDate(date)) {
    return NextResponse.json(
      { error: "Invalid date" },
      { status: 400, headers: noStore }
    );
  }
  if (!findService(serviceId)) {
    return NextResponse.json(
      { error: "Unknown serviceId" },
      { status: 400, headers: noStore }
    );
  }

  const { slots, closed } = await getAvailability(date, serviceId);

  return NextResponse.json(
    {
      date,
      serviceId,
      closed,
      hours: openingHours(date),
      slots,
      today: todayISO(),
    },
    { headers: noStore }
  );
}
