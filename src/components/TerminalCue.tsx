"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The terminal Easter egg — types out a command (`cd sweattax`, `cd ..`)
 * with a blinking block cursor. Purely decorative: parents announce the
 * navigation itself, so this stays aria-hidden.
 */
export function TerminalCue({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [chars, setChars] = useState(0);
  const shown = reduced ? command.length : chars;

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setChars((current) => {
        if (current >= command.length) {
          clearInterval(id);
          return current;
        }
        return current + 1;
      });
    }, 24);
    return () => clearInterval(id);
  }, [command, reduced]);

  return (
    <span
      aria-hidden="true"
      className={cn("font-mono text-xs text-green", className)}
    >
      $ {command.slice(0, shown)}
      <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-[2px] animate-pulse bg-green motion-reduce:animate-none" />
    </span>
  );
}
