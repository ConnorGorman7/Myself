import type { Metadata } from "next";
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
