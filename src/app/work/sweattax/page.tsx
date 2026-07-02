import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { ProjectHero } from "@/components/ProjectHero";
import { PhotoBand } from "@/components/PhotoBand";

export const metadata: Metadata = {
  title: "SweatTax",
};

export default function SweatTax() {
  return (
    <main className="mx-auto w-full max-w-3xl">
      {/* Back link + title */}
      <div className="px-6 pt-16 pb-10">
        <FadeUp>
          <Link
            href="/work"
            className="font-mono text-xs text-text-dim transition-colors hover:text-green"
          >
            ← Back
          </Link>
        </FadeUp>
        <FadeUp delay={0.05} className="mt-8">
          <ProjectHero
            slug="sweattax"
            title="SweatTax"
            year="2024"
            tags="TypeScript · React Native · AI"
          />
        </FadeUp>
      </div>

      {/*
        Project hero image — drop your shot in /public/work/sweattax-hero.jpg
        Wide or square both work here; 16:9 or 3:2 recommended.
      */}
      <PhotoBand
        src={undefined}
        alt="SweatTax app"
        ratio="16/9"
      />

      {/* Case study body */}
      <FadeUp delay={0.1} className="px-6 pt-10 pb-16">
        <div className="space-y-6 text-text-dim leading-relaxed">
          <p>Add your case study content here.</p>
        </div>
      </FadeUp>
    </main>
  );
}
