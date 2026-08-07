import type { Metadata } from "next";
import { NfcDemoClient } from "@/components/NfcDemoClient";

export const metadata: Metadata = {
  title: "NFC Demo",
  description:
    "See what an NFC sticker experience looks like — tap a phone to any surface and get an instant landing page.",
};

export default function NfcDemo() {
  return <NfcDemoClient />;
}
