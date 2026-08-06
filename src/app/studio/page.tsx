import type { Metadata } from "next";
import { StudioPageClient } from "@/components/StudioPageClient";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Hire Connor Gorman for AI engineering contract work — LLM integration, AI-powered features, SEO, and rapid prototypes.",
};

export default function Studio() {
  return <StudioPageClient />;
}
