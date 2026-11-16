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
          ) : project.logo && project.results[0] ? (
            /* Logo projects: full white panel (logos are made for white),
               logo scales with card width so it never looks mis-sized. */
            <div className="absolute inset-0 flex flex-col justify-between bg-white p-5">
              <Image
                src={project.logo.src}
                alt={project.logo.alt}
                width={project.logo.width}
                height={project.logo.height}
                sizes="(max-width: 640px) 45vw, 240px"
                className="h-auto w-[42%] max-w-60 mix-blend-multiply"
              />
              <div className="flex flex-col">
                <span className="text-3xl font-bold tracking-tight text-green sm:text-4xl">
                  {project.results[0].value}
                </span>
                <span className="mt-1 font-mono text-xs text-neutral-600">
                  {project.results[0].label}
                </span>
              </div>
            </div>
          ) : project.results[0] ? (
            /* No thumbnail: lead with the headline metric instead */
            <div className="absolute inset-0 flex flex-col justify-end bg-[radial-gradient(ellipse_at_top_left,rgba(11,102,35,0.08),transparent_60%)] p-5">
              <span className="text-3xl font-bold tracking-tight text-green sm:text-4xl">
                {project.results[0].value}
              </span>
              <span className="mt-1 font-mono text-xs text-text-dim">
                {project.results[0].label}
              </span>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-end bg-[radial-gradient(ellipse_at_top_left,rgba(11,102,35,0.08),transparent_60%)] p-5">
              <span className="font-mono text-xs uppercase tracking-widest text-text-dim">
                {project.context}
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
          {project.context && (
            <p className="-mt-1 font-mono text-xs text-text-dim">{project.context}</p>
          )}
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
