"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/work", label: "work" },
  { href: "/studio", label: "studio" },
  { href: "/contact", label: "contact" },
];

export function Nav() {
  const pathname = usePathname();
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
