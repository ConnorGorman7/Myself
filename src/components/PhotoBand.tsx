import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  /**
   * Relative path from /public — e.g. "/work-hero.jpg".
   * Omit (or leave undefined) to show the placeholder slot.
   */
  src?: string;
  alt?: string;
  /** CSS aspect-ratio value. Default "21/9" for wide editorial strips. */
  ratio?: string;
  /** Tailwind classes for the dark overlay. Default fades top+bottom into --bg. */
  overlayClassName?: string;
  /** Optional content rendered above the photo (e.g. a pull-quote). */
  children?: React.ReactNode;
  className?: string;
};

export function PhotoBand({
  src,
  alt = "",
  ratio = "21/9",
  overlayClassName,
  children,
  className,
}: Props) {
  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
      ) : (
        /* Placeholder slot — shows until you drop an image in /public */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg-elevated">
          <div className="flex flex-col items-center gap-2 rounded border border-dashed border-border px-6 py-4">
            <span className="font-mono text-xs text-text-dim">photo goes here</span>
            <span className="font-mono text-[10px] text-border">
              /public{src ?? "/<filename>.jpg"}
            </span>
          </div>
        </div>
      )}

      {/* Gradient overlays — blend top/bottom edges into page background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          overlayClassName ??
            "bg-[linear-gradient(to_bottom,var(--bg)_0%,transparent_18%,transparent_82%,var(--bg)_100%)]",
        )}
      />

      {/* Optional content overlay */}
      {children && (
        <div className="absolute inset-0 z-10 flex items-end p-8">{children}</div>
      )}
    </div>
  );
}
