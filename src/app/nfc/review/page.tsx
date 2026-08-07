import type { Metadata } from "next";
import { NfcReviewClient } from "@/components/NfcReviewClient";

export const metadata: Metadata = {
  title: "NFC Review Demo",
  description:
    "Demo: tap an NFC sticker and land instantly on a Google review prompt — no searching required.",
};

export default function NfcReviewDemo() {
  return <NfcReviewClient />;
}
