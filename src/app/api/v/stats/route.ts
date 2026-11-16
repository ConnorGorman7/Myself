import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { allVideoSlugs, getVideo } from "@/lib/videos";

export const dynamic = "force-dynamic";

/**
 * GET /api/v/stats?key=<VIDEO_STATS_KEY>
 * Lists which companies you've sent videos to, so it's locked behind a key.
 */
export async function GET(request: Request) {
  const expected = process.env.VIDEO_STATS_KEY;
  const key = new URL(request.url).searchParams.get("key");
  if (!expected || key !== expected) {
    return new NextResponse("Not found", { status: 404 });
  }

  let redis: Redis;
  try {
    redis = Redis.fromEnv();
  } catch {
    return NextResponse.json({ error: "Upstash Redis not configured" }, { status: 503 });
  }

  const slugs = allVideoSlugs();
  const fields = ["view", "play", "complete", "last_view"] as const;
  const keys = slugs.flatMap((slug) => fields.map((f) => `video:${slug}:${f}`));
  const values: (string | number | null)[] = keys.length ? await redis.mget(...keys) : [];

  const stats = slugs.map((slug, i) => {
    const [views, plays, completes, lastView] = values.slice(i * 4, i * 4 + 4);
    const video = getVideo(slug)!;
    return {
      company: video.company,
      url: `https://connorgorman.ca/v/${slug}`,
      sent: video.createdAt,
      views: Number(views ?? 0),
      plays: Number(plays ?? 0),
      completes: Number(completes ?? 0),
      lastView: lastView ?? null,
    };
  });

  return NextResponse.json(
    { stats: stats.sort((a, b) => b.sent.localeCompare(a.sent)) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
