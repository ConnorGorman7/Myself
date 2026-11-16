"use client";

import { useEffect, useRef } from "react";

type Props = {
  slug: string;
  src: string;
  captions: string;
  poster: string;
  label: string;
};

function track(slug: string, event: "view" | "play" | "complete") {
  const body = JSON.stringify({ event });
  const url = `/api/v/${encodeURIComponent(slug)}`;
  // sendBeacon survives tab close; fall back to fetch if it's unavailable/refused.
  const sent =
    typeof navigator.sendBeacon === "function" &&
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
  if (!sent) {
    fetch(url, { method: "POST", body, keepalive: true }).catch(() => {});
  }
}

/**
 * Click-to-play intro video with captions on by default.
 * Views are counted from the browser (not the server render), so link-preview
 * crawlers from LinkedIn/Slack/Gmail don't inflate the numbers.
 */
export function IntroVideoPlayer({ slug, src, captions, poster, label }: Props) {
  const played = useRef(false);
  const completed = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    track(slug, "view");
    // Some browsers ignore the `default` attribute until metadata loads.
    const t = videoRef.current?.textTracks[0];
    if (t) t.mode = "showing";
  }, [slug]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      aria-label={label}
      onPlay={() => {
        if (played.current) return;
        played.current = true;
        track(slug, "play");
      }}
      onEnded={() => {
        if (completed.current) return;
        completed.current = true;
        track(slug, "complete");
      }}
      className="aspect-video w-full rounded-md border border-green-dim bg-bg-elevated"
    >
      <track kind="captions" src={captions} srcLang="en" label="English" default />
    </video>
  );
}
