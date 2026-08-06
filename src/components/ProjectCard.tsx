"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { TerminalCue } from "@/components/TerminalCue";
import type { Project } from "@/lib/projects";

/** How long the `cd <project>` cue plays before navigating. */
const CUE_MS = 550;

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [cueing, setCueing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const href = `/work/${project.slug}`;

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    // Let open-in-new-tab combos through untouched.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    // Reduced motion: skip the cue, navigate immediately.
    if (reduced) return;
    event.preventDefault();
    if (cueing) return;
    setCueing(true);
    timeoutRef.current = setTimeout(() => router.push(href), CUE_MS);
  }

  return (
    <motion.div layoutId={`project-${project.slug}`} className="h-full">
      <Link
        href={href}
        onClick={handleClick}
        className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-bg-elevated transition duration-200 hover:border-green-dim hover:shadow-[0_0_24px_rgba(90,140,110,0.12)] focus-visible:border-green focus-visible:shadow-[0_0_24px_rgba(90,140,110,0.18)] focus-visible:outline-none"
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/7] w-full overflow-hidden border-b border-border bg-bg">
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={`${project.title} thumbnail`}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            /* Placeholder slot — shows until a thumbnail lands in /public */
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[10px] text-text-dim">
                /public/work/{project.slug}/thumb.jpg
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold text-foreground transition duration-200 group-hover:text-green">
              {project.title}
            </h3>
            <span className="shrink-0 font-mono text-xs text-text-dim">
              {project.year}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-text-dim">
            {project.oneLiner}
          </p>
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-border px-2 py-0.5 font-mono text-xs text-text-dim"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-auto flex h-5 items-center pt-1">
            {cueing ? (
              <TerminalCue command={`cd ${project.title}`} />
            ) : (
              <span className="font-mono text-xs text-green transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none">
                open →
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
