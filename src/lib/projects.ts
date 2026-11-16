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
  /** Where it shipped. Rendered as a list under "Rolled out to". */
  deployments?: { name: string; detail: string }[];
  /** Tradeoffs worth talking through in an interview. */
  decisions?: { title: string; body: string }[];
  /** A line from a manager/client. Attribute by title unless they agreed to be named. */
  quote?: { text: string; attribution: string };
  /** Activity screenshot (e.g. Azure DevOps contributions), relative to /public. */
  activity?: { src: string; alt: string; width: number; height: number; caption: string };
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
      "Hospital clerks were keying referral PDFs into the system by hand, about five minutes per referral. Every hospital has its own forms, they arrive as scans and faxes, and the patient data can't leave the hospital's cloud tenant.",
    built: [
      "Built and shipped an Intelligent Document Processing system in C# on Azure OpenAI (GPT-5.4 mini) and Azure Content Understanding. Internally it's IDP; Novari sells it as Automated Referral Transcription & Processing (ARTP). Referrals are processed in the background as they arrive, so a clerk only reviews the pre-filled result: ~5 min down to ~1 min per referral.",
      "Developed the extraction, page classification, semantic matching, and field-mapping logic. Semantic matching batches every lookup into a single LLM or embedding call and caches prior matches in SQL.",
      "Implemented it for Island Health, Thunder Bay Regional, and CAMH (Island Health alone processed 300,000+ PDFs within months, all data kept in-tenant) and helped design and build the next version, IDP V3.",
      "Reached 98.7% field-level extraction accuracy on a 50-document labeled test set through prompt iteration and post-processing.",
      "Automated cross-client regression testing: 32 forms run in parallel, cutting a full test pass from 1.5 hours to about 10 minutes, so universal changes can ship without breaking any hospital's config.",
      "Hardened it for production: Polly retry logic around layout and LLM calls, token tracking per step, structured logging for traceability, and unit and integration test suites.",
      "Fixed bugs reported by hospital staff by tracing each to its source in a large C# codebase. Oversized bounding boxes turned out to come from faulty box-selection code, not the prompts.",
    ],
    deployments: [
      { name: "Island Health (BC)", detail: "26 referral form types · 300,000+ documents processed" },
      { name: "Thunder Bay Regional Health Sciences Centre", detail: "MRI and CT referral forms" },
      { name: "CAMH", detail: "Multi-page forms across separate document types" },
      { name: "Ontario Health", detail: "Contributed to the V2 implementation" },
      { name: "Strata Health (VitalHub)", detail: "Set to be the first VitalHub product to use IDP" },
    ],
    decisions: [
      {
        title: "Dropped structured outputs",
        body: "They improved formatting but roughly doubled output tokens and pushed requests past our 240-second timeout. Plain JSON with post-processing was the better trade.",
      },
      {
        title: "A non-reasoning model for classification",
        body: "Reasoning models weren't more accurate at page classification and were slower, so classification went back to GPT-4.1 mini while extraction moved to a reasoning model.",
      },
      {
        title: "Model selection on cost, not just accuracy",
        body: "Benchmarked GPT-5 mini against Claude ahead of GPT-4's retirement. Claude was about 7× the cost for this workload; GPT-5 mini held 96–97% accuracy and stopped silently \"fixing\" values like invalid birth dates.",
      },
      {
        title: "Move logic out of the LLM",
        body: "Anything deterministic (date math, paediatric flags, field formatting) runs as post-processing code after extraction. Fewer hallucinations, and failures are debuggable.",
      },
      {
        title: "Exact grounding or nothing",
        body: "Source-highlight coordinates come from an exact word-level match. Fuzzy matching was removed: no highlight is better than a confident highlight in the wrong place.",
      },
      {
        title: "Built for a 3–4 minute pipeline",
        body: "Layout analysis plus several LLM calls takes minutes per document, so processing runs in the background on arrival rather than while a clerk waits.",
      },
    ],
    quote: {
      text: "His performance throughout the internship has been exceptional and significantly above expectations for an intern-level role.",
      attribution: "Supervisor, Novari Health · 12-month internship review",
    },
    activity: {
      src: "/work/hospital-referral-idp/devops-activity.png",
      alt: "Azure DevOps contribution graph: 963 contributions in a year, including 683 commits, 30 pull requests created, 79 pull requests reviewed, and 80 work items closed",
      width: 900,
      height: 507,
      caption: "My Azure DevOps activity over the internship: 683 commits, 30 PRs merged, 79 PRs reviewed.",
    },
    stack: [
      "C#",
      "Azure OpenAI",
      "Azure Content Understanding",
      "Python",
      "SQL Server",
      "Polly",
      "Azure DevOps",
    ],
    results: [
      { value: "5 → 1 min", label: "Per-referral processing time" },
      { value: "300k+", label: "PDFs processed, one deployment" },
      { value: "98.7%", label: "Field-level extraction accuracy" },
      { value: "1.5 h → 10 min", label: "Full regression test run" },
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
