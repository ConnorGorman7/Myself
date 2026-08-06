import Image from "next/image";
import type { Screenshot } from "@/lib/projects";

/**
 * Horizontal scroll strip for screenshots/mockups inside a project page.
 * The strip scrolls; the page never does. Focusable so keyboard users can
 * arrow through it.
 */
export function ScreenshotStrip({
  slug,
  screenshots,
  ratio,
}: {
  slug: string;
  screenshots: Screenshot[];
  ratio: string;
}) {
  return (
    <div
      role="region"
      aria-label="Project screenshots, scrolls horizontally"
      tabIndex={0}
      className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-md px-6 pb-4 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-green-dim"
    >
      {screenshots.map((shot, i) => (
        <div
          key={i}
          className="relative w-44 shrink-0 snap-start overflow-hidden rounded-md border border-border bg-bg-elevated sm:w-52"
          style={{ aspectRatio: ratio }}
        >
          {shot.src ? (
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="208px"
              className="object-cover"
            />
          ) : (
            /* Placeholder slot — shows until a shot lands in /public */
            <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
              <span className="font-mono text-[10px] leading-relaxed text-text-dim">
                /public/work/{slug}/shot-{i + 1}.jpg
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
