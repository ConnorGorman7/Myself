"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Project = {
  slug: string;
  title: string;
  year: string;
  description: string;
  tags: string[];
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div layoutId={`project-${project.slug}`} className="h-full">
      <Link
        href={`/work/${project.slug}`}
        className="group flex h-full flex-col gap-4 rounded-md border border-border bg-bg-elevated p-6 transition duration-200 hover:-translate-y-0.5 hover:border-green-dim hover:bg-bg-hover hover:shadow-[0_0_24px_rgba(90,140,110,0.12)]"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-foreground transition duration-200 group-hover:text-green">
            {project.title}
          </h3>
          <span className="shrink-0 font-mono text-xs text-text-dim">
            {project.year}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-text-dim">
          {project.description}
        </p>
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
        <span className="mt-auto font-mono text-xs text-green transition-transform duration-200 group-hover:translate-x-0.5">
          View →
        </span>
      </Link>
    </motion.div>
  );
}
