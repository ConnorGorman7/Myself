import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeUp } from "@/components/FadeUp";
import { ProjectHero } from "@/components/ProjectHero";
import { PhotoBand } from "@/components/PhotoBand";
import { BackToProjects } from "@/components/BackToProjects";
import { ScreenshotStrip } from "@/components/ScreenshotStrip";
import { projects, getProject } from "@/lib/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };
  return { title: project.title, description: project.oneLiner };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const screenshots = project.screenshots.filter((shot) => shot.src);
  const projectIndex = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(projectIndex + 1) % projects.length];

  return (
    <main className="mx-auto w-full max-w-3xl">
      {/* Back button + title */}
      <div className="px-6 pt-12 pb-10">
        <FadeUp>
          <BackToProjects />
        </FadeUp>
        <FadeUp delay={0.05} className="mt-8">
          <ProjectHero
            slug={project.slug}
            title={project.title}
            year={project.year}
            tags={project.tags.join(" · ")}
            context={project.context}
          />
        </FadeUp>
      </div>

      {/* Hero image — only when one exists; no placeholder slots in production */}
      {project.heroImage && (
        <PhotoBand src={project.heroImage} alt={project.title} ratio="16/9" />
      )}

      <div className="px-6 pt-10 pb-16">
        {/* Key results first — that's what gets scanned */}
        {project.results.length > 0 && (
          <FadeUp>
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                Key results
              </h2>
              <div
                className={`mt-5 grid grid-cols-2 gap-4 ${
                  project.results.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"
                }`}
              >
                {project.results.map((result) => (
                  <div
                    key={result.label}
                    className="rounded-md border border-border bg-bg-elevated p-5"
                  >
                    <div className="text-2xl font-bold tracking-tight text-green">
                      {result.value}
                    </div>
                    <div className="mt-1 font-mono text-xs text-text-dim">
                      {result.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </FadeUp>
        )}

        <FadeUp className={project.results.length > 0 ? "mt-14" : undefined}>
          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
              Problem
            </h2>
            <p className="mt-4 leading-relaxed text-text-dim">{project.problem}</p>
          </section>
        </FadeUp>

        <FadeUp className="mt-14">
          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
              What I built
            </h2>
            <ul className="mt-4 space-y-3">
              {project.built.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-foreground">
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-green" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </FadeUp>

        {/* Where it shipped */}
        {project.deployments && project.deployments.length > 0 && (
          <FadeUp className="mt-14">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                Rolled out to
              </h2>
              <ul className="mt-5 divide-y divide-border rounded-md border border-border bg-bg-elevated">
                {project.deployments.map((d) => (
                  <li
                    key={d.name}
                    className="flex flex-col gap-0.5 px-5 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <span className="font-medium text-foreground">{d.name}</span>
                    <span className="text-sm text-text-dim sm:text-right">{d.detail}</span>
                  </li>
                ))}
              </ul>
            </section>
          </FadeUp>
        )}

        {/* Tradeoffs — the part worth talking through in an interview */}
        {project.decisions && project.decisions.length > 0 && (
          <FadeUp className="mt-14">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                Engineering decisions
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {project.decisions.map((d) => (
                  <div key={d.title} className="rounded-md border border-border bg-bg-elevated p-5">
                    <h3 className="font-semibold text-foreground">{d.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-dim">{d.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </FadeUp>
        )}

        {project.activity && (
          <FadeUp className="mt-14">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                Activity
              </h2>
              <figure className="mt-5">
                <div className="overflow-hidden rounded-md border border-border bg-white p-3 sm:p-4">
                  <Image
                    src={project.activity.src}
                    alt={project.activity.alt}
                    width={project.activity.width}
                    height={project.activity.height}
                    sizes="(max-width: 768px) 100vw, 720px"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-xs text-text-dim">
                  {project.activity.caption}
                </figcaption>
              </figure>
            </section>
          </FadeUp>
        )}

        {project.quote && (
          <FadeUp className="mt-14">
            <figure className="border-l-2 border-green pl-5">
              <blockquote className="text-lg leading-relaxed text-foreground sm:text-xl">
                &ldquo;{project.quote.text}&rdquo;
              </blockquote>
              <figcaption className="mt-3 font-mono text-xs text-text-dim">
                {project.quote.attribution}
              </figcaption>
            </figure>
          </FadeUp>
        )}

        {/* Screenshots — horizontal scroll, the page itself never scrolls sideways */}
        {screenshots.length > 0 && (
          <FadeUp className="mt-14">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                Screenshots
              </h2>
              <div className="mt-5">
                <ScreenshotStrip
                  slug={project.slug}
                  screenshots={screenshots}
                  ratio={project.screenshotRatio}
                />
              </div>
            </section>
          </FadeUp>
        )}

        {/* Tech stack */}
        {project.stack.length > 0 && (
          <FadeUp className="mt-14">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                Tech stack
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded border border-border bg-bg-elevated px-3 py-1 font-mono text-xs text-text-dim"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          </FadeUp>
        )}


        {/* Links */}
        {project.links.length > 0 && (
          <FadeUp className="mt-14">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                Links
              </h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-md border border-green-dim bg-bg-elevated px-5 py-2.5 font-mono text-sm text-green transition duration-200 hover:border-green hover:bg-bg-hover"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </section>
          </FadeUp>
        )}

        {/* Next project */}
        {next.slug !== project.slug && (
          <div className="mt-16 border-t border-border pt-8">
            <Link
              href={`/work/${next.slug}`}
              className="group flex flex-col gap-1"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-text-dim">
                Next project
              </span>
              <span className="text-lg font-semibold text-foreground transition-colors group-hover:text-green">
                {next.title} →
              </span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
