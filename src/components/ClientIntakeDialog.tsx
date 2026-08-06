"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EMAIL = "connorgorman@live.ca";

const TIMELINES = [
  "As soon as possible",
  "In the next 1–3 months",
  "Just exploring for now",
];

const inputClass =
  "w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-foreground placeholder:text-text-dim/60 focus:border-green-dim focus:outline-none";

const labelClass = "text-sm font-medium text-foreground";

type Answers = {
  problem: string;
  company: string;
  context: string;
  timeline: string;
  name: string;
  email: string;
};

const EMPTY_ANSWERS: Answers = {
  problem: "",
  company: "",
  context: "",
  timeline: TIMELINES[1],
  name: "",
  email: "",
};

/** One short question per step; contact details come last. */
const STEP_COUNT = 5;

export function ClientIntakeDialog({
  triggerLabel,
  triggerClassName,
}: {
  triggerLabel: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const reduced = useReducedMotion();

  function set<K extends keyof Answers>(key: K, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function handleNext(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < STEP_COUNT - 1) {
      setStep(step + 1);
      return;
    }

    const subject = `Project inquiry — ${answers.company || answers.name}`;
    const body = [
      `Name: ${answers.name}`,
      `Email: ${answers.email}`,
      `Company / product: ${answers.company || "—"}`,
      "",
      "The problem:",
      answers.problem,
      "",
      "Existing systems / what's been tried:",
      answers.context || "—",
      "",
      `Timeline: ${answers.timeline}`,
    ].join("\n");

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setOpen(false);
    setStep(0);
  }

  const steps = [
    <div key="problem" className="space-y-2">
      <label htmlFor="intake-problem" className={labelClass}>
        What problem are you trying to solve?
      </label>
      <textarea
        id="intake-problem"
        required
        rows={4}
        autoFocus
        value={answers.problem}
        onChange={(e) => set("problem", e.target.value)}
        placeholder="In your own words — what's slow, manual, or missing?"
        className={inputClass}
      />
    </div>,
    <div key="company" className="space-y-2">
      <label htmlFor="intake-company" className={labelClass}>
        What does your company or product do?
      </label>
      <input
        id="intake-company"
        autoFocus
        value={answers.company}
        onChange={(e) => set("company", e.target.value)}
        placeholder="One line is plenty"
        className={inputClass}
      />
    </div>,
    <div key="context" className="space-y-2">
      <label htmlFor="intake-context" className={labelClass}>
        What already exists?
      </label>
      <textarea
        id="intake-context"
        rows={4}
        autoFocus
        value={answers.context}
        onChange={(e) => set("context", e.target.value)}
        placeholder="Your stack, where the data lives, anything you've tried — optional"
        className={inputClass}
      />
    </div>,
    <fieldset key="timeline" className="space-y-2">
      <legend className={labelClass}>When do you want this?</legend>
      <div className="mt-2 space-y-2">
        {TIMELINES.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition duration-150 ${
              answers.timeline === option
                ? "border-green-dim bg-bg-hover text-foreground"
                : "border-border bg-bg text-text-dim hover:border-green-dim/50"
            }`}
          >
            <input
              type="radio"
              name="timeline"
              value={option}
              checked={answers.timeline === option}
              onChange={() => set("timeline", option)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                answers.timeline === option ? "bg-green" : "bg-border"
              }`}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>,
    <div key="contact" className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="intake-name" className={labelClass}>
          Your name
        </label>
        <input
          id="intake-name"
          required
          autoFocus
          autoComplete="name"
          value={answers.name}
          onChange={(e) => set("name", e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="intake-email" className={labelClass}>
          Email to reply to
        </label>
        <input
          id="intake-email"
          type="email"
          required
          autoComplete="email"
          value={answers.email}
          onChange={(e) => set("email", e.target.value)}
          className={inputClass}
        />
      </div>
      <p className="text-xs leading-relaxed text-text-dim">
        Sending opens your email app with everything filled in — nothing sends
        until you hit send.
      </p>
    </div>,
  ];

  const isLast = step === STEP_COUNT - 1;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={triggerClassName}>
        {triggerLabel}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-lg border border-border bg-bg-elevated p-6 transition-all duration-200 data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0 motion-reduce:transition-none sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-md sm:data-[ending-style]:translate-y-[calc(-50%+8px)] sm:data-[starting-style]:translate-y-[calc(-50%+8px)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-foreground">
                Start a project
              </Dialog.Title>
              <Dialog.Description className="mt-1 font-mono text-xs text-text-dim">
                {step + 1} / {STEP_COUNT}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close"
              className="rounded-md p-1 font-mono text-sm text-text-dim transition-colors hover:text-green"
            >
              ✕
            </Dialog.Close>
          </div>

          <form onSubmit={handleNext} className="mt-5">
            <div className="min-h-44">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={reduced ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  {steps[step]}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="font-mono text-xs text-text-dim transition-colors hover:text-green"
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-green-dim bg-bg px-6 py-2.5 font-mono text-sm text-green transition duration-200 hover:border-green hover:bg-bg-hover"
              >
                {isLast ? "Send it →" : "Next →"}
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
