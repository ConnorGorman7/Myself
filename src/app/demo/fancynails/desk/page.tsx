import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { OwnerBook } from "@/components/fancynails/OwnerBook";
import { isValidDate, todayISO } from "@/lib/fancynails/dates";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Book — Fancy Nails front desk",
  description:
    "Every appointment in one list — online, phone, and walk-in — with a print button for the front desk.",
  robots: { index: false, follow: false },
};

export default async function DeskPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const initialDate = date && isValidDate(date) ? date : todayISO();

  return (
    <div className={cormorant.variable}>
      <OwnerBook initialDate={initialDate} />
    </div>
  );
}
