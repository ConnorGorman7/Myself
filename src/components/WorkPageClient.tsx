"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { FadeUp } from "@/components/FadeUp";
import { StaggerList, StaggerItem } from "@/components/Stagger";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

type Role = {
  company: string;
  title: string;
  dates: string;
  description: string;
};

const experience: Role[] = [
  {
    company: "Novari Health, VitalHub Company",
    title: "AI Engineer Intern",
    dates: "May 2025 — Present",
    description:
      "Owned and shipped a production Intelligent Document Processing system used in live hospital workflows — reducing referral processing time from ~5 minutes to ~1 minute. Processed 300,000+ real-world healthcare PDFs under strict privacy and compliance constraints. Improved extraction reliability to 98.7% on key form sections through prompt iteration and edge-case handling. Reduced processing overhead ~90% via batched LLM calls, embedding reuse, and multithreaded execution.",
  },
];

export function WorkPageClient() {
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
          src="/work/workBackground.png"
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
              src="/work/workHeroVideo.mp4"
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
            className="relative z-10 mx-auto w-full max-w-5xl"
          >
            {/* Profile header */}
            <div className="px-6 pt-16 pb-12">
              <FadeUp>
                <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">AI Engineer</h1>
                    <p className="mt-1 font-mono text-sm text-text-dim">
                      Building AI-powered products, end to end.
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <a
                      href="mailto:connorgorman@live.ca"
                      className="font-mono text-xs text-text-dim transition-colors hover:text-green"
                    >
                      Email ↗
                    </a>
                    <a
                      href="https://github.com/ConnorGorman7"
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-text-dim transition-colors hover:text-green"
                    >
                      GitHub ↗
                    </a>
                    <a
                      href="https://www.linkedin.com/in/connor-gorman7"
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-text-dim transition-colors hover:text-green"
                    >
                      LinkedIn ↗
                    </a>
                  </div>
                </section>
              </FadeUp>
            </div>

            {/* Projects */}
            <div className="px-6 pt-12 pb-0">
              <FadeUp>
                <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                  Projects
                </h2>
              </FadeUp>
              <StaggerList className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {projects.map((project) => (
                  <StaggerItem key={project.slug} className="h-full">
                    <ProjectCard project={project} />
                  </StaggerItem>
                ))}
                <StaggerItem>
                  <div className="flex min-h-[180px] items-center justify-center rounded-md border border-dashed border-border p-6">
                    <span className="select-none font-mono text-sm tracking-widest text-text-dim">
                      · · ·
                    </span>
                  </div>
                </StaggerItem>
              </StaggerList>
            </div>

            {/* Experience */}
            <div className="px-6 pt-14 pb-16">
              <div className="border-t border-border pt-10">
                <FadeUp>
                  <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                    Experience
                  </h2>
                </FadeUp>
                <StaggerList className="mt-6 space-y-8">
                  {experience.map((role, i) => (
                    <StaggerItem key={i}>
                      <div className="flex flex-col gap-1 border-l-2 border-border pl-5">
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="font-medium text-foreground">
                              {role.title}
                            </span>
                            <span className="text-text-dim">·</span>
                            <span className="text-text-dim">{role.company}</span>
                          </div>
                          <span className="font-mono text-xs text-text-dim">
                            {role.dates}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-text-dim">
                          {role.description}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerList>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
