import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  /**
   * Relative path from /public — e.g. "/work/workBackground.png".
   * Used as a static image, and as the poster/fallback for videoSrc.
   * Omit (or leave undefined) to show the placeholder slot.
   */
  src?: string;
  /**
   * Relative path from /public to an mp4 — e.g. "/work/workHeroVideo.mp4".
   * Plays muted, no loop. Respects prefers-reduced-motion by
   * falling back to src (the poster frame) when motion is reduced.
   */
  videoSrc?: string;
  alt?: string;
  /**
   * Full-viewport mode: h-screen instead of a fixed aspect ratio.
   * Use for page-topping heroes. Default false.
   */
  fullscreen?: boolean;
  /** CSS aspect-ratio value. Used when fullscreen is false. Default "21/9". */
  ratio?: string;
  /** Tailwind classes for the dark overlay. Defaults differ by fullscreen mode. */
  overlayClassName?: string;
  /** Optional content rendered above the photo (e.g. a pull-quote). */
  children?: React.ReactNode;
  className?: string;
};

export function PhotoBand({
  src,
  videoSrc,
  alt = "",
  fullscreen = false,
  ratio = "21/9",
  overlayClassName,
  children,
  className,
}: Props) {
  const hasContent = src || videoSrc;

  const defaultOverlay = fullscreen
    ? "bg-[linear-gradient(to_bottom,transparent_60%,var(--bg)_100%)]"
    : "bg-[linear-gradient(to_bottom,var(--bg)_0%,transparent_18%,transparent_82%,var(--bg)_100%)]";

  return (
    <div
      className={cn("relative w-full overflow-hidden", fullscreen ? "h-screen" : "", className)}
      style={fullscreen ? undefined : { aspectRatio: ratio }}
    >
      {hasContent ? (
        videoSrc ? (
          <>
            {/* Video plays once; CSS hides it for reduced-motion users */}
            <video
              src={videoSrc}
              poster={src}
              autoPlay
              muted
              playsInline
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
            />
            {/* Poster frame shown when prefers-reduced-motion is set */}
            {src && (
              <Image
                src={src}
                alt={alt}
                fill
                className="hidden object-cover motion-reduce:block"
                sizes="100vw"
              />
            )}
          </>
        ) : (
          <Image
            src={src!}
            alt={alt}
            fill
            className="object-cover"
            sizes={fullscreen ? "100vw" : "(max-width: 1024px) 100vw, 1024px"}
          />
        )
      ) : (
        /* Placeholder slot */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg-elevated">
          <div className="flex flex-col items-center gap-2 rounded border border-dashed border-border px-6 py-4">
            <span className="font-mono text-xs text-text-dim">photo goes here</span>
            <span className="font-mono text-[10px] text-border">
              /public{src ?? "/<filename>.jpg"}
            </span>
          </div>
        </div>
      )}

      {/* Gradient overlay — blends edges into page background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          overlayClassName ?? defaultOverlay,
        )}
      />

      {/* Optional content overlay */}
      {children && (
        <div className="absolute inset-0 z-10 flex items-end p-8">{children}</div>
      )}
    </div>
  );
}
