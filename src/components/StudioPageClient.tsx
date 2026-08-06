"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { FadeUp } from "@/components/FadeUp";
import { StaggerList, StaggerItem } from "@/components/Stagger";
import { ClientIntakeDialog } from "@/components/ClientIntakeDialog";

const services = [
  {
    index: "01",
    title: "AI features for existing products",
    description:
      "Integrate LLMs, embeddings, and inference into your product — from a scoped proof-of-concept to production-ready.",
  },
  {
    index: "02",
    title: "Get found on Google",
    description:
      "SEO-tuned websites and simple systems that turn happy customers into Google reviews — more visibility, more trust, more business.",
  },
  {
    index: "03",
    title: "Rapid prototypes",
    description:
      "From idea to working demo in days. Useful for validating a bet before committing engineering resources.",
  },
];

export function StudioPageClient() {
  const prefersReduced = useReducedMotion();
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Skip the video entirely for users who prefer reduced motion
  useEffect(() => {
    if (prefersReduced) setVideoEnded(true);
  }, [prefersReduced]);

  // Play at 2× so the intro never feels like a gate
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 2;
  }, []);

  return (
    <>
      {/* Fixed PNG background — sits behind everything, persists through full scroll */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <Image
          src="/client/clientBackground.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay so text stays readable against the background */}
        <div className="absolute inset-0 bg-bg/60" />
      </div>

      {/* Video intro — fades out when it ends */}
      <AnimatePresence>
        {!videoEnded && (
          <motion.div
            className="fixed inset-0 z-40"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <video
              ref={videoRef}
              src="/client/clientHeroVideo.mp4"
              autoPlay
              muted
              playsInline
              onEnded={() => setVideoEnded(true)}
              className="h-full w-full object-cover"
              aria-hidden="true"
            />
            <button
              onClick={() => setVideoEnded(true)}
              className="absolute bottom-6 right-6 font-mono text-xs text-white/50 transition-colors hover:text-white/90"
            >
              skip →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content — fades in after video ends, overlaid on the background */}
      <AnimatePresence>
        {videoEnded && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 mx-auto w-full max-w-4xl"
          >
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
                    <ClientIntakeDialog
                      triggerLabel="Let's talk →"
                      triggerClassName="inline-flex items-center justify-center rounded-md border border-green-dim bg-bg-elevated px-6 py-3 font-mono text-sm text-green transition duration-200 hover:border-green hover:bg-bg-hover"
                    />
                  </div>
                </section>
              </FadeUp>
            </div>

            {/* Services */}
            <div className="px-6 pt-12 pb-16">
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
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
