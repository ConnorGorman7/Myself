import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { StaggerList, StaggerItem } from "@/components/Stagger";
import { PhotoBand } from "@/components/PhotoBand";

export const metadata: Metadata = {
  title: "Studio",
};

const services = [
  {
    index: "01",
    title: "AI features for existing products",
    description:
      "Integrate LLMs, embeddings, and inference into your product — from a scoped proof-of-concept to production-ready.",
  },
  {
    index: "02",
    title: "End-to-end ML systems",
    description:
      "Data pipelines, model training, and serving infrastructure. Built to be maintained, not just demoed.",
  },
  {
    index: "03",
    title: "Rapid prototypes",
    description:
      "From idea to working demo in days. Useful for validating a bet before committing engineering resources.",
  },
];

export default function Studio() {
  return (
    <main className="mx-auto w-full max-w-4xl">
      {/* Above-fold: headline + CTA */}
      <div className="px-6 pt-16 pb-12">
        <FadeUp>
          <section className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Build with AI.
              </h1>
              <p className="mt-4 max-w-prose text-text-dim">
                I&apos;m Connor — an AI engineer available for focused contract
                work. I take on a small number of projects at a time so each one
                gets full attention.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-green-dim bg-bg-elevated px-6 py-3 font-mono text-sm text-green transition duration-200 hover:border-green hover:bg-bg-hover"
              >
                Let&apos;s talk →
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-6 py-3 font-mono text-sm text-text-dim transition duration-200 hover:border-green-dim hover:text-green"
              >
                See past work
              </Link>
            </div>
          </section>
        </FadeUp>
      </div>

      {/*
        Atmospheric photo — drop a shot in /public/studio-hero.jpg
        Works best with a wide, moody frame: tech setup, workspace, etc.
      */}
      <PhotoBand
        src={undefined}
        alt="Connor's workspace"
        ratio="21/9"
      />

      {/* Services */}
      <div className="px-6 pt-12 pb-0">
        <FadeUp>
          <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
            Services
          </h2>
        </FadeUp>
        <StaggerList className="mt-8 space-y-8">
          {services.map((service) => (
            <StaggerItem key={service.index}>
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-8">
                <span className="shrink-0 font-mono text-xs text-text-dim sm:w-8 sm:pt-1">
                  {service.index}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-dim">
                    {service.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>

      {/* Contact CTA */}
      <div className="px-6 pt-16 pb-16">
        <FadeUp>
          <div className="rounded-md border border-green-dim bg-bg-elevated p-8">
            <h2 className="font-semibold text-foreground">Ready to start?</h2>
            <p className="mt-2 text-sm text-text-dim">
              Available for new projects. Let&apos;s figure out if it&apos;s a
              fit.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center font-mono text-sm text-green transition-colors hover:underline"
            >
              Get in touch →
            </Link>
          </div>
        </FadeUp>
      </div>
    </main>
  );
}
