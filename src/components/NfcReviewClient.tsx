"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ClientIntakeDialog } from "@/components/ClientIntakeDialog";

const LABELS = ["Terrible", "Poor", "Okay", "Good", "Excellent"];

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-label="Google">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function StarIcon({ filled, hovered }: { filled: boolean; hovered: boolean }) {
  const active = filled || hovered;
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-10 w-10 transition-colors duration-100 ${active ? "text-[#f5a623]" : "text-[#dadce0]"}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ReviewSheet({ onPosted }: { onPosted: () => void }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handlePost(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onPosted, 1400);
  }

  if (submitted) {
    return (
      <motion.div
        className="flex flex-col items-center gap-3 py-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-4xl">🎉</span>
        <p className="text-base font-medium text-[#202124]">Review posted!</p>
        <p className="text-sm text-[#70757a]">Thanks for sharing your experience.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handlePost} className="flex flex-col gap-5">
      {/* Business info */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8f0fe] text-lg font-bold text-[#4285F4]">
          M
        </div>
        <div>
          <p className="text-sm font-semibold text-[#202124]">Maple Street Café</p>
          <p className="text-xs text-[#70757a]">Coffee shop · 4.6 ★ · 312 reviews</p>
        </div>
      </div>

      {/* Stars */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1" role="group" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n !== 1 ? "s" : ""} — ${LABELS[n - 1]}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              className="focus:outline-none"
            >
              <StarIcon filled={n <= rating} hovered={n <= hovered} />
            </button>
          ))}
        </div>
        <p className="h-4 font-mono text-xs text-[#70757a]">
          {hovered ? LABELS[hovered - 1] : rating ? LABELS[rating - 1] : "Tap to rate"}
        </p>
      </div>

      {/* Text area */}
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share details of your own experience at this place"
        className="w-full resize-none rounded-sm border border-[#dadce0] bg-white px-3 py-2 text-sm text-[#202124] placeholder:text-[#70757a] focus:border-[#4285F4] focus:outline-none focus:ring-1 focus:ring-[#4285F4]"
      />

      {/* Action row */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="rounded px-4 py-2 text-sm font-medium text-[#4285F4] transition-colors hover:bg-[#f1f3f4]"
          onClick={() => { setRating(0); setText(""); }}
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={rating === 0}
          className="rounded bg-[#4285F4] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3367d6] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Post
        </button>
      </div>
    </form>
  );
}

export function NfcReviewClient() {
  const [phase, setPhase] = useState<"ripple" | "sheet" | "thanks">("ripple");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { setPhase("sheet"); return; }
    const t = setTimeout(() => setPhase("sheet"), 1900);
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
            transition={{ duration: 0.5 }}
          >
            <div className="relative flex items-center justify-center">
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
              <motion.div
                className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-green-dim bg-bg-elevated"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-green" aria-hidden="true">
                  <path d="M6 8a6 6 0 0 1 12 0v8a6 6 0 0 1-12 0V8z" />
                  <path d="M9 12h6" /><path d="M12 9v6" />
                </svg>
              </motion.div>
            </div>
            <motion.p className="font-mono text-xs text-text-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}>
              tap detected
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google review sheet */}
      <AnimatePresence>
        {(phase === "sheet" || phase === "thanks") && (
          <motion.div
            key="sheet"
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* The sheet itself — white like Google's UI */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Sheet handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-8 rounded-full bg-[#dadce0]" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 pt-2">
                <div className="flex items-center gap-2">
                  <GoogleLogo />
                  <span className="text-sm font-medium text-[#202124]">Reviews</span>
                </div>
                <span className="rounded-full bg-[#e8f5e9] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#1e8e3e]">
                  demo
                </span>
              </div>

              <div className="h-px bg-[#f1f3f4]" />

              {/* Review form */}
              <div className="px-5 py-5">
                <AnimatePresence mode="wait">
                  {phase !== "thanks" ? (
                    <ReviewSheet key="form" onPosted={() => setPhase("thanks")} />
                  ) : (
                    <motion.div
                      key="done"
                      className="flex flex-col items-center gap-3 py-8 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <span className="text-4xl">🎉</span>
                      <p className="text-base font-medium text-[#202124]">Review posted!</p>
                      <p className="text-sm text-[#70757a]">Thanks for sharing your experience.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Demo callout */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <p className="font-mono text-xs text-text-dim">
                customers tap your sticker → instantly land here
              </p>
              <p className="mt-1 font-mono text-xs text-text-dim">
                no searching, no friction — more reviews
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
