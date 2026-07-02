"use client";

import { motion } from "framer-motion";

type Props = {
  slug: string;
  title: string;
  year: string;
  tags: string;
};

export function ProjectHero({ slug, title, year, tags }: Props) {
  return (
    <motion.div layoutId={`project-${slug}`}>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <span className="font-mono text-sm text-text-dim">{year}</span>
      </div>
      <p className="mt-2 font-mono text-xs text-text-dim">{tags}</p>
    </motion.div>
  );
}
