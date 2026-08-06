export type ProjectLink = {
  label: string;
  href: string;
};

export type Screenshot = {
  /** Relative path from /public — omit to show the placeholder slot. */
  src?: string;
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  /** One line on the card — keep it under ~90 characters. */
  oneLiner: string;
  tags: string[];
  /** Card thumbnail, relative to /public. Omit to show the placeholder slot. */
  thumbnail?: string;
  /** Detail-page hero image, relative to /public. */
  heroImage?: string;
  problem: string;
  solution: string;
  stack: string[];
  results: { value: string; label: string }[];
  /** Rendered only if non-empty — GitHub, live demo, App Store, etc. */
  links: ProjectLink[];
  screenshots: Screenshot[];
  /** CSS aspect-ratio for screenshots. Phone apps ≈ "9/19", web ≈ "16/10". */
  screenshotRatio: string;
};

// ── Update these with your real content ──────────────────────────────────────

export const projects: Project[] = [
  {
    slug: "sweattax",
    title: "SweatTax",
    year: "2025",
    oneLiner: "Social fitness app that holds you accountable to your workouts — verified by GPS and motion, not the honour system.",
    tags: ["React Native", "TypeScript", "Supabase", "Postgres"],
    thumbnail: "/work/sweattax/sweattaxthumb.png",
    heroImage: undefined,
    problem:
      "Fitness accountability apps rely on self-reported data — easy to fake, easy to ignore. Users needed a system that actually verified you showed up and did the work, without a personal trainer or a gym buddy.",
    solution:
      "Built a solo-engineered iOS app from first commit to App Store in ~5 months. Workouts are verified server-side using GPS geofencing (75–150m radius, 5-min dwell) combined with timer and accelerometer validation — all pass/fail decisions happen on the server, not the client. XP and progress are stored in Postgres as the source of truth after early users reported data loss on reinstall. Shipped 3 production releases post-launch driven by real bug reports.",
    stack: ["React Native", "TypeScript", "Supabase", "Postgres", "EAS / Expo"],
    results: [
      { value: "~5 mo", label: "First commit to App Store" },
      { value: "3", label: "Post-launch releases" },
      { value: "17", label: "SQL migrations, zero data loss" },
    ],
    links: [
      { label: "App Store ↗", href: "https://apps.apple.com/ca/app/sweattax/id6757535535" },
    ],
    screenshots: [
      { alt: "SweatTax home screen" },
      { alt: "SweatTax workout verification" },
      { alt: "SweatTax progress tracking" },
    ],
    screenshotRatio: "9/19",
  },
  {
    slug: "dateplanned",
    title: "DatePlanned",
    year: "2025",
    oneLiner: "Full-stack web app that generates personalized date plans based on your location, vibe, and budget.",
    tags: ["Full-Stack", "TypeScript", "AI"],
    thumbnail: "/work/dateplanned/dateplannedthumb.png",
    heroImage: undefined,
    problem:
      "Planning a date night involves juggling reservations, proximity, budget, and personal taste across a dozen different apps. Most people default to whatever's nearby and familiar.",
    solution:
      "Built a full-stack prototype that takes location, category, and budget as inputs and generates a structured date plan by integrating external data sources. Handled both the backend logic and the UI. Tested with 20 real users.",
    stack: ["TypeScript", "Next.js", "External APIs"],
    results: [
      { value: "20", label: "User tests" },
      { value: "Full-stack", label: "Solo built" },
    ],
    links: [],
    screenshots: [
      { alt: "DatePlanned plan generator" },
      { alt: "DatePlanned results view" },
    ],
    screenshotRatio: "16/10",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
