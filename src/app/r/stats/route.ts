import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import redirects from "@/data/review-links.json";

export const dynamic = "force-dynamic";

type ReviewLink = {
  name: string;
  deployedAt?: string;
};

const businesses = redirects.businesses as Record<string, ReviewLink>;

export async function GET() {
  let redis: Redis;
  try {
    redis = Redis.fromEnv();
  } catch {
    return NextResponse.json(
      { error: "KV not configured — add Upstash Redis via Vercel Integrations" },
      { status: 503 }
    );
  }

  const deployed = Object.entries(businesses).filter(
    ([, v]) => v.deployedAt
  );

  const keys = deployed.map(([slug]) => `hits:${slug}`);
  const counts: (number | null)[] = keys.length
    ? await redis.mget(...keys)
    : [];

  const stats = deployed.map(([slug, business], i) => ({
    slug,
    name: business.name,
    deployedAt: business.deployedAt,
    hits: counts[i] ?? 0,
  }));

  stats.sort((a, b) => (b.hits as number) - (a.hits as number));

  return NextResponse.json({ stats }, { headers: { "Cache-Control": "no-store" } });
}
