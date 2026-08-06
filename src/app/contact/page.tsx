import type { Metadata } from "next";
import { FadeUp } from "@/components/FadeUp";
import { StaggerList, StaggerItem } from "@/components/Stagger";
import { ClientIntakeDialog } from "@/components/ClientIntakeDialog";

export const metadata: Metadata = {
  title: "Contact — Connor Gorman",
  description:
    "Get in touch with Connor Gorman — for AI engineering contract work, or to connect about career opportunities.",
};

const EMAIL = "connorgorman@live.ca";

const careerLinks = [
  { label: "Email ↗", href: `mailto:${EMAIL}` },
  {
    label: "LinkedIn ↗",
    href: "https://www.linkedin.com/in/connor-gorman7",
    external: true,
  },
  {
    label: "GitHub ↗",
    href: "https://github.com/ConnorGorman7",
    external: true,
  },
];

export default function Contact() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <FadeUp>
        <h1 className="text-4xl font-bold tracking-tight">Let&apos;s talk.</h1>
        <p className="mt-3 text-text-dim">
          Two paths, depending on who you are.
        </p>
      </FadeUp>

      <StaggerList className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StaggerItem className="h-full">
          <div className="flex h-full flex-col gap-6 rounded-md border border-border bg-bg-elevated p-8">
            <span className="font-mono text-xs uppercase tracking-widest text-green">
              For clients
            </span>
            <div className="flex flex-1 flex-col gap-3">
              <h2 className="text-lg font-semibold leading-snug text-foreground">
                Start a project
              </h2>
              <p className="text-sm leading-relaxed text-text-dim">
                You have a pain point and want AI built around it. A few quick
                questions give me everything I need to show up prepared.
              </p>
            </div>
            <ClientIntakeDialog
              triggerLabel="Tell me about it →"
              triggerClassName="inline-flex items-center justify-center self-start rounded-md border border-green-dim bg-bg px-5 py-2.5 font-mono text-sm text-green transition duration-200 hover:border-green hover:bg-bg-hover"
            />
          </div>
        </StaggerItem>

        <StaggerItem className="h-full">
          <div className="flex h-full flex-col gap-6 rounded-md border border-border bg-bg-elevated p-8">
            <span className="font-mono text-xs uppercase tracking-widest text-green">
              For recruiters
            </span>
            <div className="flex flex-1 flex-col gap-3">
              <h2 className="text-lg font-semibold leading-snug text-foreground">
                Talk careers
              </h2>
              <p className="text-sm leading-relaxed text-text-dim">
                Hiring? My projects and experience are on the work page — and
                I&apos;m easy to reach directly.
              </p>
            </div>
            <div className="flex items-center gap-5">
              {careerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  className="font-mono text-sm text-green transition-colors hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </StaggerItem>
      </StaggerList>
    </main>
  );
}
