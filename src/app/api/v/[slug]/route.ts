import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { getVideo } from "@/lib/videos";

export const dynamic = "force-dynamic";

let redis: Redis | null = null;
try {
  redis = Redis.fromEnv();
} catch {
  // KV not configured (e.g. local dev) — events are dropped
}

const EVENTS = new Set(["view", "play", "complete"]);

export async function POST(request: Request, context: RouteContext<"/api/v/[slug]">) {
  const { slug } = await context.params;
  if (!getVideo(slug)) return new NextResponse(null, { status: 404 });

  let event: unknown;
  try {
    ({ event } = await request.json());
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (typeof event !== "string" || !EVENTS.has(event)) {
    return new NextResponse(null, { status: 400 });
  }

  if (redis) {
    await Promise.all([
      redis.incr(`video:${slug}:${event}`),
      // Timestamp of the most recent event, so stats show "last opened".
      redis.set(`video:${slug}:last_${event}`, new Date().toISOString()),
    ]).catch(() => {});
  }
  return new NextResponse(null, { status: 204 });
}
