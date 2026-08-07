"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ClientIntakeDialog } from "@/components/ClientIntakeDialog";

function NfcIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 text-green"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0v8a6 6 0 0 1-12 0V8z" />
      <path d="M9 12h6" />
      <path d="M12 9v6" />
    </svg>
  );
}

export function NfcDemoClient() {
  const [phase, setPhase] = useState<"ripple" | "card">("ripple");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setPhase("card");
      return;
    }
    const t = setTimeout(() => setPhase("card"), 1900);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-6 py-16">
      {/* Ripple phase */}
      <AnimatePresence>
        {phase === "ripple" && (
          <motion.div
            key="ripple"
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="relative flex items-center justify-center">
              {/* Expanding rings */}
              {[0, 0.35, 0.7].map((delay) => (
                <motion.span
                  key={delay}
                  className="absolute rounded-full border border-green/30"
                  style={{ width: 72, height: 72 }}
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 3.5, opacity: 0 }}
                  transition={{ duration: 1.1, delay, ease: "easeOut" }}
                />
              ))}
              {/* Center icon */}
              <motion.div
                className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-green-dim bg-bg-elevated"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <NfcIcon />
              </motion.div>
            </div>

            <motion.p
              className="font-mono text-xs text-text-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              tap detected
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card phase */}
      <AnimatePresence>
        {phase === "card" && (
          <motion.div
            key="card"
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Digital card */}
            <div className="overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-2xl">
              {/* Header stripe */}
              <div className="h-1 w-full bg-gradient-to-r from-green/0 via-green to-green/0" />

              <div className="px-8 pb-8 pt-7 text-center">
                {/* Avatar */}
                <motion.div
                  className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-green-dim bg-bg text-xl font-bold text-green"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  CG
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1 className="text-2xl font-bold tracking-tight">Connor Gorman</h1>
                  <p className="mt-0.5 font-mono text-xs text-text-dim">AI Engineer</p>
                </motion.div>

                <motion.p
                  className="mt-4 text-sm leading-relaxed text-text-dim"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  Building AI-powered products and tools. Available for focused contract work.
                </motion.p>

                {/* Action links */}
                <motion.div
                  className="mt-7 flex flex-col gap-2.5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href="mailto:connorgorman@live.ca"
                    className="flex items-center justify-center rounded-md border border-green-dim bg-bg px-4 py-3 font-mono text-sm text-green transition duration-200 hover:border-green hover:bg-bg-hover"
                  >
                    Email me
                  </a>
                  <a
                    href="https://www.linkedin.com/in/connor-gorman7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-md border border-border bg-bg px-4 py-3 font-mono text-sm text-foreground transition duration-200 hover:border-green-dim hover:bg-bg-hover"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://connorgorman.ca/studio"
                    className="flex items-center justify-center rounded-md border border-border bg-bg px-4 py-3 font-mono text-sm text-foreground transition duration-200 hover:border-green-dim hover:bg-bg-hover"
                  >
                    Hire me for a project
                  </a>
                </motion.div>
              </div>
            </div>

            {/* Demo callout */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <p className="font-mono text-xs text-text-dim">
                this page lives on an NFC sticker
              </p>
              <p className="mt-1 font-mono text-xs text-text-dim">
                tap a phone to any surface → instant landing page
              </p>
              <div className="mt-5">
                <ClientIntakeDialog
                  triggerLabel="Get one for your business →"
                  triggerClassName="font-mono text-sm text-green underline underline-offset-4 transition-colors hover:text-green/70"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
