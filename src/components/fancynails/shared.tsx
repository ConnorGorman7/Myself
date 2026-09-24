import Image from "next/image";
import type { Photo } from "@/lib/fancynails/config";

/* Palette is deliberately hard-coded rather than using the portfolio's design
   tokens — this demo has to read as the salon's brand, not as connorgorman.ca. */
export const C = {
  cream: "#fbf7f4",
  panel: "#fdfaf8",
  white: "#ffffff",
  ink: "#3a3033",
  muted: "#6b5f62",
  faint: "#a3969a",
  rose: "#b76e79",
  roseDark: "#9a5560",
  roseSoft: "#f9eef0",
  border: "#efe0da",
  borderSoft: "#f0e3dd",
  field: "#e6d5ce",
} as const;

export const serif = "[font-family:var(--font-cormorant)]";

/** A real photo once `src` is set, a labelled placeholder until then. */
export function PhotoFrame({
  photo,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  photo: Photo;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (photo.src) {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-[#f7ece7] ${className}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-[#ecdcd4] bg-gradient-to-br from-[#f7ece7] to-[#efdcd6] text-[#b98f86] ${className}`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10" r="1.5" />
          <path d="m21 16-4.5-4.5L7 21" />
        </svg>
        <span className="text-xs tracking-wide">{photo.label}</span>
      </div>
    </div>
  );
}

export const inputCls =
  "w-full rounded-lg border border-[#e6d5ce] bg-white px-3.5 py-2.5 text-sm text-[#3a3033] placeholder:text-[#b6a9ac] outline-none transition-colors focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/25";

export function Field({
  label,
  className = "",
  hint,
  children,
}: {
  label: string;
  className?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#6b5f62]">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[#a3969a]">{hint}</span>}
    </label>
  );
}

export function Check({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
