import type { Metadata } from "next";
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
  return { title: project?.title ?? "Project" };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

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
          />
        </FadeUp>
      </div>

      {/* Hero image — drop a shot at /public/work/<slug>/hero.jpg */}
      <PhotoBand src={project.heroImage} alt={project.title} ratio="16/9" />

      <div className="px-6 pt-10 pb-16">
        {/* Problem / Solution */}
        <FadeUp>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                Problem
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-text-dim sm:text-base">
                {project.problem}
              </p>
            </section>
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                Solution
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-text-dim sm:text-base">
                {project.solution}
              </p>
            </section>
          </div>
        </FadeUp>

        {/* Key results */}
        {project.results.length > 0 && (
          <FadeUp className="mt-14">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                Key results
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {project.results.map((result, i) => (
                  <div
                    key={i}
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

        {/* Screenshots — horizontal scroll, the page itself never scrolls sideways */}
        {project.screenshots.length > 0 && (
          <FadeUp className="mt-14">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                Screenshots
              </h2>
              <div className="mt-5">
                <ScreenshotStrip
                  slug={project.slug}
                  screenshots={project.screenshots}
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
      </div>
    </main>
  );
}
