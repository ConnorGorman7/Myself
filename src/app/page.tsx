import Link from "next/link";
import { HeroCanvas } from "@/components/HeroCanvas";
import { FadeUp } from "@/components/FadeUp";

export default function Home() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-10 p-8">
      {/* Hero frame — radial gradient is allowed only here per DESIGN.md §6 */}
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-[6px] border border-border"
        style={{ aspectRatio: "16/9" }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, var(--bg) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-bg-elevated">
          <HeroCanvas />
        </div>
      </div>

      {/* Soft split */}
      <FadeUp delay={0.15} className="w-full max-w-xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/work"
            className="flex flex-1 items-center justify-center rounded-md border border-green-dim bg-bg-elevated px-6 py-5 font-mono text-sm text-green transition duration-200 hover:border-green hover:bg-bg-hover"
          >
            [see what I&apos;m building]
          </Link>
          <Link
            href="/studio"
            className="flex flex-1 items-center justify-center rounded-md border border-green-dim bg-bg-elevated px-6 py-5 font-mono text-sm text-green transition duration-200 hover:border-green hover:bg-bg-hover"
          >
            [work with me]
          </Link>
        </div>
      </FadeUp>
    </main>
  );
}
