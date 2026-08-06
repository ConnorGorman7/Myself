import type { Metadata } from "next";
import { StudioPageClient } from "@/components/StudioPageClient";

export const metadata: Metadata = {
  title: "Studio",
};

export default function Studio() {
  return <StudioPageClient />;
}
