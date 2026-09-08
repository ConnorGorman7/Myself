import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import redirects from "@/data/review-links.json";

type ReviewLink = {
  name: string;
  address?: string;
  placeId?: string;
  googleUrl: string;
  deployedAt?: string;
};

const reviewLinks = redirects.businesses as Record<string, ReviewLink>;

export const dynamic = "force-dynamic";

let redis: Redis | null = null;
try {
  redis = Redis.fromEnv();
} catch {
  // KV not configured — hits won't be tracked
}

export async function GET(
  request: Request,
  context: RouteContext<"/r/[slug]">
) {
  const { slug } = await context.params;
  const review = reviewLinks[slug];

  if (!review) {
    return new NextResponse("Review link not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  console.info(
    JSON.stringify({
      event: "review_redirect",
      slug,
      name: review.name,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    })
  );

  // fire-and-forget — don't block the redirect on KV latency
  redis?.incr(`hits:${slug}`).catch(() => {});

  return NextResponse.redirect(review.googleUrl, {
    status: 307,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
