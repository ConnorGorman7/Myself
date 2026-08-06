import type { Metadata } from "next";
import { WorkPageClient } from "@/components/WorkPageClient";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Connor Gorman's portfolio — AI Engineer projects, internship experience, and shipped products including SweatTax and DatePlanned.",
};

export default function Work() {
  return <WorkPageClient />;
}
