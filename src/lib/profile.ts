// Single source for contact links and resume-derived profile facts.
// Content mirrors public/connor-gorman-resume.pdf — keep them in sync.

export const RESUME_HREF = "/connor-gorman-resume.pdf";
export const EMAIL = "connorgorman@live.ca";
export const LINKEDIN = "https://www.linkedin.com/in/connor-gorman7";
export const GITHUB = "https://github.com/ConnorGorman7";

export type Role = {
  title: string;
  company: string;
  dates: string;
  location: string;
  summary: string;
  /** Optional case-study route for this role. */
  caseStudy?: string;
  quote?: { text: string; attribution: string };
};

export const experience: Role[] = [
  {
    title: "AI Engineering Developer Intern",
    company: "Novari Health (VitalHub)",
    dates: "May 2025 – Aug 2026",
    location: "Kingston, ON",
    summary:
      "Built and shipped a production LLM document-processing system for hospital referrals (C#, Azure OpenAI). It processed 300,000+ PDFs from one deployment at 98.7% field-level accuracy and cut processing from ~5 min to ~1 min. Also prepped data for AutoML imaging-protocol prediction (98% top-5 across ~120 classes) and prototyped a RAG-based SMS reminder agent.",
    caseStudy: "/work/hospital-referral-idp",
  },
  {
    title: "Independent Technology Consultant",
    company: "Self-employed",
    dates: "Sept 2026 – Present",
    location: "Kingston, ON",
    summary:
      "Scoped and delivered a paid engagement for Cultivate Kingston: a call-booking flow, a reviews section, and SEO plus AI-search optimization, kept on Squarespace so non-technical staff can maintain it.",
    caseStudy: "/work/cultivate-kingston",
  },
];

/**
 * Verbatim lines from the Novari internship reviews (4/8/12-month co-op
 * evaluations + the supervisor's contributions summary). Attributed by title only.
 */
export const managerReview = {
  featured: {
    text: "Overall, his performance throughout the internship has been exceptional and significantly above expectations for an intern-level role.",
    source: "12-month review",
  },
  quotes: [
    {
      text: "He has played a critical role in the successful rollout and adoption of AI applications by ensuring implementations are stable, well-tested, user-friendly, and aligned with business requirements.",
      source: "12-month review",
    },
    {
      text: "His diligence, attention to detail, and commitment to quality helped build a strong foundation for the successful deployment of AI capabilities to the client.",
      source: "On the Island Health go-live",
    },
    {
      text: "100% meet the deadlines of significant milestones for AI projects, made great contributions to the project success.",
      source: "8-month review",
    },
    {
      text: "He is highly dependable, learns quickly, and consistently delivers results within project timelines while maintaining a high standard of work.",
      source: "12-month review",
    },
  ],
  attribution: "Supervisor, Novari Health",
  rating: "Rated Excellent in 7 of 8 categories at the 12-month review",
};

export const education = {
  school: "Queen's University",
  degree: "B.Sc. Computer Engineering · Dean's Scholar",
  dates: "Expected Apr 2027",
  gpa: "3.70",
};

export const skills: { label: string; items: string }[] = [
  { label: "Languages", items: "Python, C#, TypeScript, SQL" },
  {
    label: "AI / ML",
    items:
      "LLM integration (Azure OpenAI, OpenAI, Claude), RAG, AI agents, LLM evaluation, prompt engineering, structured outputs, guardrails, AutoML",
  },
  {
    label: "Backend & mobile",
    items: "React Native, Supabase, PostgreSQL, REST APIs, data pipelines, multithreading",
  },
  { label: "Cloud & tools", items: "Azure, Azure DevOps, Kubernetes (local dev), Git, EAS, CI/CD" },
];
