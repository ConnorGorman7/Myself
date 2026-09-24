import { NextResponse } from "next/server";
import { getStorageMode, resetDemo } from "@/lib/fancynails/store";

export const dynamic = "force-dynamic";

/**
 * POST /api/demo/fancynails/reset
 * Clears every demo booking so the book goes back to a clean set of examples.
 * Lets whoever's showing this practise first, then wipe it before the real run.
 * Only touches the `fnd:` keyspace — the /r review-link counters are untouched.
 */
export async function POST() {
  const cleared = await resetDemo();
  return NextResponse.json(
    { ok: true, cleared, storageMode: getStorageMode() },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
