import type { Metadata } from "next";
import { FadeUp } from "@/components/FadeUp";
import { StaggerList, StaggerItem } from "@/components/Stagger";

export const metadata: Metadata = {
  title: "Contact — Connor Gorman",
};

const EMAIL = "connorgorman@live.ca";

const intents = [
  {
    index: "01",
    title: "Hire me for a project",
    description:
      "You're building something and need an AI engineer. Let's figure out scope, timeline, and fit.",
    label: "Let's talk",
    href: `mailto:${EMAIL}?subject=Project%20Inquiry`,
  },
  {
    index: "02",
    title: "I have an idea",
    description:
      "You've got a half-formed concept and want to think it through with someone who builds this stuff.",
    label: "Let's think",
    href: `mailto:${EMAIL}?subject=Idea%20%2F%20Collaboration`,
  },
  {
    index: "03",
    title: "Just say hi",
    description: "No agenda, no project. You just want to connect.",
    label: "Say hi",
    href: `mailto:${EMAIL}`,
  },
];

export default function Contact() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <FadeUp>
        <h1 className="text-4xl font-bold tracking-tight">Let&apos;s talk.</h1>
        <p className="mt-3 text-text-dim">
          Pick whichever fits and I&apos;ll get back to you.
        </p>
      </FadeUp>

      <StaggerList className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {intents.map((intent) => (
          <StaggerItem key={intent.index} className="h-full">
            <a
              href={intent.href}
              className="group flex h-full flex-col gap-6 rounded-md border border-border bg-bg-elevated p-8 transition duration-200 hover:-translate-y-0.5 hover:border-green-dim hover:bg-bg-hover hover:shadow-[0_0_24px_rgba(90,140,110,0.12)]"
            >
              <span className="font-mono text-xs text-text-dim">
                {intent.index}
              </span>
              <div className="flex flex-1 flex-col gap-3">
                <h2 className="text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-green">
                  {intent.title}
                </h2>
                <p className="text-sm leading-relaxed text-text-dim">
                  {intent.description}
                </p>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-sm text-green">
                {intent.label}
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          </StaggerItem>
        ))}
      </StaggerList>

      <FadeUp className="mt-10">
        <p className="font-mono text-xs text-text-dim">
          Or reach me directly:{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="text-green transition-colors hover:underline"
          >
            {EMAIL}
          </a>
        </p>
      </FadeUp>
    </main>
  );
}
