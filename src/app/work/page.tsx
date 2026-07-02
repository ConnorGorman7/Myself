import type { Metadata } from "next";
import { FadeUp } from "@/components/FadeUp";
import { StaggerList, StaggerItem } from "@/components/Stagger";
import { ProjectCard } from "@/components/ProjectCard";
import { PhotoBand } from "@/components/PhotoBand";

export const metadata: Metadata = {
  title: "Work",
};

type Project = {
  slug: string;
  title: string;
  year: string;
  description: string;
  tags: string[];
};

type Role = {
  company: string;
  title: string;
  dates: string;
  description: string;
};

// ── Update these with your real content ──────────────────────────────────────

const projects: Project[] = [
  {
    slug: "sweattax",
    title: "SweatTax",
    year: "2024",
    description:
      "Add your project description — what it does, what you shipped, and what you learned.",
    tags: ["TypeScript", "React Native", "AI"],
  },
];

const experience: Role[] = [
  {
    company: "Company Name",
    title: "Role Title",
    dates: "20XX — Present",
    description: "Brief description of what you built or led.",
  },
  {
    company: "Company Name",
    title: "Role Title",
    dates: "20XX — 20XX",
    description: "Brief description of what you built or led.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function Work() {
  return (
    <main className="mx-auto w-full max-w-5xl">
      {/* Profile header */}
      <div className="px-6 pt-16 pb-12">
        <FadeUp>
          <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">AI Engineer</h1>
              <p className="mt-1 font-mono text-sm text-text-dim">
                Building intelligent systems at the intersection of ML and product.
              </p>
            </div>
            <div className="flex items-center gap-5">
              <a
                href="https://github.com/ConnorGorman7"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-text-dim transition-colors hover:text-green"
              >
                GitHub ↗
              </a>
              <a
                href="#"
                className="font-mono text-xs text-text-dim transition-colors hover:text-green"
              >
                LinkedIn ↗
              </a>
            </div>
          </section>
        </FadeUp>
      </div>

      {/*
        Atmospheric photo — drop your shot in /public/work-hero.jpg
        Landscape or wide-format works best (21:9). The gradient handles
        blending into the dark background at top and bottom edges.
      */}
      <PhotoBand
        src={undefined}
        alt="Connor working"
        ratio="21/9"
      />

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

          {/* Visual placeholder slot */}
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
    </main>
  );
}
