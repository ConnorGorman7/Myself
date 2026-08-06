import type { Metadata } from "next";
import { WorkPageClient } from "@/components/WorkPageClient";

export const metadata: Metadata = {
  title: "Work",
};

export default function Work() {
  return <WorkPageClient />;
}
