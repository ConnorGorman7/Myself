export type ProjectLink = {
  label: string;
  href: string;
};

export type Screenshot = {
  /** Relative path from /public. Screenshots without a src are not rendered. */
  src?: string;
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  /** Where/for whom — e.g. "Novari Health (VitalHub)". Shown under the title. */
  context?: string;
  year: string;
  /** One line on the card — keep it under ~110 characters. */
  oneLiner: string;
  tags: string[];
  /** Card thumbnail, relative to /public. Omit to show the headline-metric card instead. */
  thumbnail?: string;
  /**
   * Company/client logo shown on the card above the headline metric when there's
   * no thumbnail. Rendered on a white tile, so full-colour logos read on dark cards.
   */
  logo?: { src: string; alt: string; width: number; height: number };
  /** Detail-page hero image, relative to /public. Omit to hide the band entirely. */
  heroImage?: string;
  problem: string;
  /** Rendered as a bullet list on the project page. */
  built: string[];
  stack: string[];
  results: { value: string; label: string }[];
  /** Rendered only if non-empty — GitHub, live demo, App Store, etc. */
  links: ProjectLink[];
  screenshots: Screenshot[];
  /** CSS aspect-ratio for screenshots. Phone apps ≈ "9/19", web ≈ "16/10". */
  screenshotRatio: string;
};

// Content is sourced from the resume (public/connor-gorman-resume.pdf).
// Keep the two in sync when either changes.

export const projects: Project[] = [
  {
    slug: "hospital-referral-idp",
    title: "Hospital Referral IDP",
    context: "Novari Health (VitalHub)",
    year: "2025–26",
    oneLiner:
      "Production LLM document pipeline in live hospital workflows. Cut referral processing from ~5 min to ~1 min.",
    tags: ["C#", "Azure OpenAI", "Python", "LLM Eval"],
    logo: {
      src: "/work/hospital-referral-idp/novari-logo.png",
      alt: "Novari Health, a VitalHub company",
      width: 768,
      height: 219,
    },
    problem:
      "Hospital staff were keying referral PDFs into the system by hand, about five minutes per referral. The forms vary by clinic, arrive as scans, and contain patient data that can't leave the hospital's tenant.",
    built: [
      "Built and shipped an Intelligent Document Processing system in C# on Azure OpenAI (GPT-5.4 mini) and Azure Content Understanding, cutting referral processing time from ~5 min to ~1 min.",
      "Developed the extraction, classification, semantic matching, and field-mapping logic for a pipeline that processed 300,000+ healthcare PDFs from a single BC deployment within months, with all patient data kept in-tenant.",
      "Reached 98.7% field-level extraction accuracy on a 50-document labeled test set through prompt iteration and post-processing.",
      "Built a multithreaded Python batch-testing tool for regression and accuracy evaluation across every form type and edge case. Batched LLM calls and embedding reuse cut test-run time by ~90%.",
      "Evaluated structured outputs for extraction and dropped them: they roughly doubled output tokens and pushed requests past the 240-second timeout, which outweighed the formatting-accuracy gain.",
      "Fixed bugs reported by hospital staff by tracing each to its source in a large C# codebase. Oversized bounding boxes turned out to come from faulty box-selection code, not the prompts.",
    ],
    stack: [
      "C#",
      "Azure OpenAI",
      "Azure Content Understanding",
      "Python",
      "Embeddings",
      "Azure DevOps",
    ],
    results: [
      { value: "5 → 1 min", label: "Per-referral processing time" },
      { value: "300k+", label: "PDFs processed, one deployment" },
      { value: "98.7%", label: "Field-level extraction accuracy" },
      { value: "~90%", label: "Faster eval test runs" },
    ],
    links: [],
    screenshots: [],
    screenshotRatio: "16/10",
  },
  {
    slug: "cultivate-kingston",
    title: "Cultivate Kingston",
    context: "Paid client engagement",
    year: "2026",
    oneLiner:
      "Call booking, reviews, and SEO plus AI-search optimization, kept on Squarespace so staff can maintain it.",
    tags: ["Client Work", "SEO", "AI Search", "Squarespace"],
    thumbnail: "/work/cultivate-kingston/thumb.jpg",
    heroImage: "/work/cultivate-kingston/hero.jpg",
    problem:
      "Cultivate Kingston needed a way for people to book calls, show social proof, and get found, both in regular search and in AI assistants. The site had to stay on Squarespace so non-technical staff could keep running it after handoff.",
    built: [
      "Scoped and delivered the engagement end to end, from requirements to handoff.",
      "Added a call-booking flow and a reviews section to the existing site.",
      "Did SEO and AI-search optimization so the business surfaces in both search engines and AI assistant answers.",
      "Kept everything inside Squarespace so staff can maintain it without a developer.",
    ],
    stack: ["Squarespace", "SEO", "AI-search optimization"],
    results: [],
    links: [{ label: "Live site ↗", href: "https://www.cultivatekingston.com/" }],
    screenshots: [],
    screenshotRatio: "16/10",
  },
  {
    slug: "dateplanned",
    title: "DatePlanned",
    context: "Side project",
    year: "2025",
    oneLiner:
      "LLM chatbot that turns your address, date type, and budget into a plan with real nearby venues.",
    tags: ["TypeScript", "OpenAI API", "Supabase"],
    thumbnail: "/work/dateplanned/dateplannedthumb.png",
    problem:
      "Planning a date means juggling proximity, budget, and taste across a dozen apps. Most people default to whatever's nearby and familiar.",
    built: [
      "Built an LLM chatbot that turns a user's address, date type, and budget into a plan with real nearby venues.",
      "Added address autocomplete in the front end so location input is fast and valid.",
      "Tested with 20 users.",
    ],
    stack: ["TypeScript", "Supabase", "OpenAI API"],
    results: [{ value: "20", label: "User tests" }],
    links: [],
    screenshots: [],
    screenshotRatio: "16/10",
  },
  {
    slug: "sweattax",
    title: "SweatTax",
    context: "Solo project · on the App Store",
    year: "2025–",
    oneLiner:
      "iOS fitness accountability app, shipped solo. Workouts verified by GPS geofencing, not the honour system.",
    tags: ["React Native", "TypeScript", "Supabase", "Postgres"],
    thumbnail: "/work/sweattax/sweattaxthumb.png",
    problem:
      "Fitness accountability apps rely on self-reported workouts, which are easy to fake and easy to ignore. I wanted a system that actually verified you showed up, without needing a trainer or a gym buddy.",
    built: [
      "Shipped solo from idea to App Store approval in ~5 months of part-time work alongside a full-time internship.",
      "Built server-side workout verification using GPS geofencing and a dwell timer. Pass/fail is decided on the server, not the client.",
      "Cleared 2 App Review rejections by redesigning monetization from payment penalties to social accountability.",
      "Moved XP and progress tracking from device-local storage to PostgreSQL after beta testers lost progress on reinstall, using SQL migrations that preserved existing accounts.",
    ],
    stack: ["React Native", "TypeScript", "Supabase", "PostgreSQL", "EAS / Expo", "Claude Code"],
    results: [
      { value: "~5 mo", label: "Idea to App Store, part-time" },
      { value: "2", label: "App Review rejections cleared" },
      { value: "17", label: "SQL migrations, zero data loss" },
    ],
    links: [
      { label: "App Store ↗", href: "https://apps.apple.com/ca/app/sweattax/id6757535535" },
    ],
    screenshots: [],
    screenshotRatio: "9/19",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
