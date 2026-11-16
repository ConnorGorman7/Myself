import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeUp } from "@/components/FadeUp";
import { IntroVideoPlayer } from "@/components/IntroVideoPlayer";
import { EMAIL, LINKEDIN, RESUME_HREF } from "@/lib/profile";
import { allVideoSlugs, formatDuration, getVideo } from "@/lib/videos";

type Params = { params: Promise<{ slug: string }> };

// Only slugs in src/data/videos.json exist; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return allVideoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) return { title: "Not found" };

  const title = `Connor Gorman, for ${video.company}`;
  const description = `A ${formatDuration(video.durationSec)} intro video from Connor Gorman, AI Engineer.`;
  return {
    title: { absolute: title },
    description,
    // Personal pages: shareable by link, never indexed.
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: `/v/${slug}`,
      type: "video.other",
      images: [{ url: video.poster, width: 1280, height: 720, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [video.poster] },
  };
}

export default async function IntroVideoPage({ params }: Params) {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) notFound();

  const greeting = video.recipient ? `Hi ${video.recipient},` : `Hi ${video.company} team,`;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pt-12 pb-20 sm:pt-16">
      <FadeUp>
        <p className="font-mono text-xs uppercase tracking-widest text-green">
          Intro · {formatDuration(video.durationSec)}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{greeting}</h1>
        {video.role && (
          <p className="mt-2 text-text-dim">
            Re: <span className="text-foreground">{video.role}</span>
          </p>
        )}
      </FadeUp>

      {/* TLDR first: many people will read this and never press play, which is fine. */}
      {video.tldr.length > 0 && (
        <FadeUp delay={0.05} className="mt-8">
          <section className="rounded-md border border-border bg-bg-elevated p-5 sm:p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">TL;DR</h2>
            <ul className="mt-4 space-y-2.5">
              {video.tldr.map((line) => (
                <li key={line} className="flex gap-3 leading-relaxed text-foreground">
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-green" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        </FadeUp>
      )}

      <FadeUp delay={0.1} className="mt-8">
        <IntroVideoPlayer
          slug={video.slug}
          src={video.videoUrl}
          captions={video.captions}
          poster={video.poster}
          label={`Intro video from Connor Gorman for ${video.company}`}
        />
      </FadeUp>

      <FadeUp delay={0.15} className="mt-10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a
            href={RESUME_HREF}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-md border border-green-dim bg-bg-elevated px-5 font-mono text-sm text-green transition duration-200 hover:border-green hover:bg-bg-hover"
          >
            Resume (PDF) ↗
          </a>
          <Link
            href="/"
            className="inline-flex h-11 items-center font-mono text-sm text-text-dim transition-colors hover:text-green"
          >
            Portfolio →
          </Link>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Re: intro video (${video.company})`)}`}
            className="inline-flex h-11 items-center font-mono text-sm text-text-dim transition-colors hover:text-green"
          >
            Email ↗
          </a>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center font-mono text-sm text-text-dim transition-colors hover:text-green"
          >
            LinkedIn ↗
          </a>
        </div>
      </FadeUp>
    </main>
  );
}
