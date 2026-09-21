"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Context-aware nav: once a visitor picks a lane on the landing split,
 * the other lane never appears up here. Switching lanes = clicking the
 * name back to the landing choice. Contact lives in each lane's own page
 * (direct links on /work, the intake dialog on /studio), not up here.
 */
function linksFor(pathname: string) {
  if (pathname.startsWith("/work")) {
    return [{ href: "/work", label: "work" }];
  }
  if (pathname.startsWith("/studio")) {
    return [{ href: "/studio", label: "studio" }];
  }
  // Landing (and anything else): the split cards are the navigation.
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
        </ul>
      </nav>
    </header>
  );
}
