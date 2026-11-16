import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { StaggerList, StaggerItem } from "@/components/Stagger";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";
import {
  EMAIL,
  GITHUB,
  LINKEDIN,
  RESUME_HREF,
  education,
  experience,
  skills,
} from "@/lib/profile";

export const metadata: Metadata = {
  description:
    "Connor Gorman: AI Engineer. Built a production LLM document pipeline that processed 300,000+ hospital referrals. Canadian citizen, TN-eligible, open to relocation.",
};

const secondaryLink =
  "inline-flex h-11 items-center font-mono text-sm text-text-dim transition-colors hover:text-green";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <>
      {/* Fixed background art, heavily dimmed so it never competes with text */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <Image
          src="/work/workBackground.png"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-bg/75" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-5xl px-6">
        {/* Hero: everything a recruiter needs in the first screen */}
        <section className="pt-16 pb-14 sm:pt-24 sm:pb-20">
          <FadeUp>
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              Connor Gorman
            </h1>
            <p className="mt-4 font-mono text-base tracking-wide text-green sm:text-lg">
              AI Engineer
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground sm:text-xl">
              I ship production software end to end. Most recently, an LLM
              pipeline that&apos;s processed 300,000+ hospital referrals, cutting
              each one from 5 minutes to 1.
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <ul className="mt-6 flex flex-col gap-1 font-mono text-xs text-text-dim sm:flex-row sm:flex-wrap sm:gap-x-4">
              <li>Ottawa, ON</li>
              <li>
                <span className="text-foreground">Canadian citizen, TN-eligible</span>
              </li>
              <li>Open to relocation</li>
              <li>Comp Eng, Queen&apos;s &apos;27</li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href={RESUME_HREF}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center rounded-md border border-green-dim bg-bg-elevated px-5 font-mono text-sm text-green transition duration-200 hover:border-green hover:bg-bg-hover"
              >
                Resume (PDF) ↗
              </a>
              <a href={`mailto:${EMAIL}`} className={secondaryLink}>
                Email ↗
              </a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className={secondaryLink}>
                LinkedIn ↗
              </a>
              <a href={GITHUB} target="_blank" rel="noreferrer" className={secondaryLink}>
                GitHub ↗
              </a>
            </div>
          </FadeUp>
        </section>

        {/* Selected work */}
        <section className="border-t border-border pt-12 pb-14">
          <FadeUp>
            <SectionLabel>Selected work</SectionLabel>
          </FadeUp>
          <StaggerList className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <StaggerItem key={project.slug} className="h-full">
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </StaggerList>
        </section>

        {/* Experience */}
        <section className="border-t border-border pt-12 pb-14">
          <FadeUp>
            <SectionLabel>Experience</SectionLabel>
          </FadeUp>
          <StaggerList className="mt-6 space-y-10">
            {experience.map((role) => (
              <StaggerItem key={role.title}>
                <div className="flex flex-col gap-1 border-l-2 border-green-dim pl-5">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-medium text-foreground">{role.title}</span>
                      <span className="text-text-dim">·</span>
                      <span className="text-text-dim">{role.company}</span>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-text-dim">
                      {role.dates}
                    </span>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-dim sm:text-base">
                    {role.summary}
                  </p>
                  {role.caseStudy && (
                    <Link
                      href={role.caseStudy}
                      className="mt-2 inline-flex h-8 items-center self-start font-mono text-xs text-green transition-transform duration-200 hover:translate-x-0.5 motion-reduce:transition-none"
                    >
                      Read the case study →
                    </Link>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </section>

        {/* Education + skills */}
        <section className="grid grid-cols-1 gap-12 border-t border-border pt-12 pb-16 sm:grid-cols-[1fr_2fr]">
          <FadeUp>
            <SectionLabel>Education</SectionLabel>
            <div className="mt-6">
              <p className="font-medium text-foreground">{education.school}</p>
              <p className="mt-1 text-sm text-text-dim">{education.degree}</p>
              <p className="mt-2 font-mono text-xs text-text-dim">
                {education.dates} · GPA {education.gpa}
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <SectionLabel>Skills</SectionLabel>
            <dl className="mt-6 space-y-3">
              {skills.map((group) => (
                <div key={group.label} className="grid grid-cols-1 gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                  <dt className="font-mono text-xs text-text-dim sm:pt-0.5">{group.label}</dt>
                  <dd className="text-sm leading-relaxed text-foreground">{group.items}</dd>
                </div>
              ))}
            </dl>
          </FadeUp>
        </section>

        {/* Closing contact */}
        <section className="border-t border-border pt-12 pb-20">
          <FadeUp>
            <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Hiring for an AI or product engineering role?
            </p>
            <p className="mt-3 text-text-dim">
              I&apos;m easiest to reach by email.{" "}
              <a href={`mailto:${EMAIL}`} className="text-green hover:underline">
                {EMAIL}
              </a>
            </p>
          </FadeUp>
        </section>
      </main>
    </>
  );
}
