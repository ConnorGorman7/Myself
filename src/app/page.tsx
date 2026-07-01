import Link from "next/link";
import { HeroCanvas } from "@/components/HeroCanvas";

export default function Home() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-12 p-8">
      {/* Hero frame — radial gradient is allowed only here per DESIGN.md §6 */}
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-[6px] border border-[#1c1f1d]"
        style={{ aspectRatio: "16/9" }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, #0a0b0c 100%)",
          }}
        />
        <div className="absolute inset-0 bg-bg-elevated">
          <HeroCanvas />
        </div>
      </div>

      {/* Soft split — copy TBD */}
      <div className="flex w-full max-w-xl flex-col gap-4 sm:flex-row">
        <Link
          href="/work"
          className="flex flex-1 items-center justify-center rounded-md border border-green-dim bg-bg-elevated px-6 py-5 font-mono text-sm text-green transition-colors hover:border-green hover:bg-bg-hover"
        >
          [see what I&apos;m building]
        </Link>
        <Link
          href="/studio"
          className="flex flex-1 items-center justify-center rounded-md border border-green-dim bg-bg-elevated px-6 py-5 font-mono text-sm text-green transition-colors hover:border-green hover:bg-bg-hover"
        >
          [work with me]
        </Link>
      </div>
    </main>
  );
}
