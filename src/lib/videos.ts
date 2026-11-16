import data from "@/data/videos.json";

/**
 * One intro video per company, served at /v/<slug>.
 * Entries are added by `npm run video` (scripts/video/process.mjs);
 * the TLDR is filled in by hand afterwards.
 */
export type IntroVideo = {
  /** company slug + random suffix, e.g. "stripe-k3x9" — not guessable across companies */
  slug: string;
  company: string;
  /** Optional first name for the greeting, e.g. "Sarah" → "Hi Sarah". */
  recipient?: string;
  /** Optional role being applied for, shown under the greeting. */
  role?: string;
  /** 2–4 short bullets shown above the video. */
  tldr: string[];
  /** Public Vercel Blob URL of the compressed mp4. */
  videoUrl: string;
  /** Captions + poster live in /public/v/<slug>.{vtt,jpg} so typos can be fixed in git. */
  captions: string;
  poster: string;
  durationSec: number;
  createdAt: string;
};

const videos = (data as { videos: Record<string, IntroVideo> }).videos;

export function getVideo(slug: string): IntroVideo | undefined {
  return Object.hasOwn(videos, slug) ? videos[slug] : undefined;
}

export function allVideoSlugs(): string[] {
  return Object.keys(videos);
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
}
