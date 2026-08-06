import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";

export const metadata: Metadata = {
  description:
    "Connor Gorman is an AI Engineer based in Canada, building intelligent systems and AI-powered products end to end. Available for contract work.",
};

export default function Home() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-10 p-8">
      <h1 className="sr-only">Connor Gorman — AI Engineer</h1>
      {/* Soft split — each path leads with who it's for */}
      <FadeUp className="w-full max-w-2xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/work"
            className="group flex flex-1 flex-col gap-3 rounded-md border border-green-dim bg-bg-elevated p-6 transition duration-200 hover:border-green hover:bg-bg-hover"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-green">
              For recruiters
            </span>
            <span className="text-sm text-foreground">
              My career, projects &amp; experience{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
          <Link
            href="/studio"
            className="group flex flex-1 flex-col gap-3 rounded-md border border-green-dim bg-bg-elevated p-6 transition duration-200 hover:border-green hover:bg-bg-hover"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-green">
              For clients
            </span>
            <span className="text-sm text-foreground">
              Hire me to build AI for your product{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </div>
      </FadeUp>
    </main>
  );
}
