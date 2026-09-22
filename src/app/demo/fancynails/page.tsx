import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { FancyNailsDemo } from "@/components/FancyNailsDemo";

// Elegant serif for display headings — scoped to this demo only.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fancy Nails — Kingston Nail Salon & Waxing",
  description:
    "Fancy Nails in Kingston, ON — manicures, pedicures, nail art, and waxing. Book your appointment today.",
  robots: { index: false, follow: false },
};

export default function FancyNailsPage() {
  return (
    <div className={cormorant.variable}>
      <FancyNailsDemo />
    </div>
  );
}
