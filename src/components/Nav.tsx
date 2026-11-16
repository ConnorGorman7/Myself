"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RESUME_HREF } from "@/lib/profile";

/**
 * The site is recruiter-first: "/" is the portfolio. /studio is still live
 * (unlisted) for direct client links and keeps its own lane label; it never
 * links back into the portfolio nav and vice versa.
 */
function linksFor(pathname: string) {
  if (pathname.startsWith("/studio")) {
    return [{ href: "/studio", label: "studio" }];
  }
  return [];
}

export function Nav() {
  const pathname = usePathname();

  // Standalone client demos render their own chrome — hide the portfolio nav.
  if (pathname.startsWith("/demo")) return null;

  const links = linksFor(pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-mono text-sm text-text-dim transition-colors hover:text-green"
        >
          Connor Gorman
        </Link>
        <ul className="flex list-none items-center gap-6">
          {links.map(({ href, label }) => {
            const isActive = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-1.5 font-mono text-sm transition-colors hover:text-green ${
                    isActive ? "text-green" : "text-text-dim"
                  }`}
                >
                  {isActive && (
                    <span
                      className="h-1 w-1 rounded-full bg-green"
                      aria-hidden="true"
                    />
                  )}
                  {label}
                </Link>
              </li>
            );
          })}
          {!pathname.startsWith("/studio") && (
            <li>
              <a
                href={RESUME_HREF}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-text-dim transition-colors hover:text-green"
              >
                resume ↗
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
