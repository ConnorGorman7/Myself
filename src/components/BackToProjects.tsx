"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { TerminalCue } from "@/components/TerminalCue";

/** How long the `cd ..` cue plays before navigating back to the grid. */
const CUE_MS = 450;

export function BackToProjects() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [cueing, setCueing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (reduced) return;
    event.preventDefault();
    if (cueing) return;
    setCueing(true);
    timeoutRef.current = setTimeout(() => router.push("/work"), CUE_MS);
  }

  return (
    <Link
      href="/work"
      onClick={handleClick}
      className="inline-flex h-9 min-w-44 items-center justify-center gap-2 rounded-md border border-border bg-bg-elevated px-4 font-mono text-xs text-text-dim transition duration-200 hover:border-green-dim hover:text-green focus-visible:border-green focus-visible:text-green focus-visible:outline-none"
    >
      {cueing ? (
        <TerminalCue command="cd .." />
      ) : (
        <>← Back to projects</>
      )}
    </Link>
  );
}
