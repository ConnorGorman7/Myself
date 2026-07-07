import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";

export default function Home() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-10 p-8">
      {/* Soft split */}
      <FadeUp className="w-full max-w-xl">
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
