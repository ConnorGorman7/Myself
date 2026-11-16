import type { Metadata } from "next";
import { StudioPageClient } from "@/components/StudioPageClient";

// Unlisted while the site is recruiter-first: still reachable by direct link
// (e.g. from the NFC demo), but kept out of search and the sitemap.
export const metadata: Metadata = {
  robots: { index: false },
  title: "Studio",
  description:
    "Hire Connor Gorman for AI engineering contract work — LLM integration, AI-powered features, SEO, and rapid prototypes.",
};

export default function Studio() {
  return <StudioPageClient />;
}
