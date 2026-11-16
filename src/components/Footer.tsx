"use client";

import { usePathname } from "next/navigation";
import { EMAIL, GITHUB, LINKEDIN } from "@/lib/profile";

export function Footer() {
  const pathname = usePathname();

  // Standalone client demos render their own chrome — hide the portfolio footer.
  if (pathname.startsWith("/demo")) return null;

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-mono text-xs text-text-dim">
          © {new Date().getFullYear()} Connor Gorman
        </span>
        <div className="flex items-center gap-5">
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-text-dim transition-colors hover:text-green"
          >
            LinkedIn ↗
          </a>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-text-dim transition-colors hover:text-green"
          >
            GitHub ↗
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="font-mono text-xs text-text-dim transition-colors hover:text-green"
          >
            Email ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
