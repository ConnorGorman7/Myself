# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`connorgorman.ca` — a dual-audience portfolio site with two distinct sections sharing one visual system:

- `/work` — personality-forward career portfolio for recruiters
- `/studio` — results-first client pitch page, mobile-first in testing order
- `/contact` — 2–3 intent-based clickable cards (not a generic form)

The landing page offers both paths as a soft split within one page, not a toggle UI. No blog — socials cover that.

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript + Tailwind
- **UI primitives**: shadcn/ui + Radix
- **Motion**: Framer Motion (shared `layoutId` morph from project card → project page). GSAP + ScrollTrigger only if Framer Motion proves insufficient for the hero sequence — don't reach for it by default.
- **Hero animation**: tsParticles, using its `shape-image` / `shape-text` plugins for the photo→name→motif morph. Use tsParticles' own movement/transition config — don't hand-roll particle physics. A standalone prototype lives (or will live) at `prototypes/hero-pixel-morph.html`; port from there rather than rebuilding from scratch.
- **Hosting**: Vercel, connected to GitHub for auto-deploy + per-branch previews
- **Domain/DNS**: Porkbun, A/CNAME records (not a nameserver swap — preserves existing email forwarding)
- **Contact**: not yet decided — Resend vs. Cal.com, pending final contact-page intents. Don't pick one unprompted.

**Commands**:
```
npm run dev      # dev server on :3000
npm run build    # production build
npm run lint     # eslint
```

**Tailwind color utilities**: design tokens are wired as Tailwind classes — use `bg-bg-elevated`, `text-green`, `text-text-dim`, `bg-bg-hover`, `text-green-dim`, etc. Raw CSS vars (`var(--bg-elevated)`) also work for arbitrary values.

## Working Conventions

- **Audit before acting.** At the start of any session, check what currently exists in the repo and confirm your understanding before making changes.
- **One concern per session.** Don't bundle unrelated changes (e.g. scaffolding Next.js and building the hero animation are two separate sessions, not one).
- **Pause and ask** rather than guessing on anything in "Open Decisions" below, or on copy/content that hasn't been written yet (landing page framing, contact intent wording, etc.) — don't invent placeholder copy and present it as final.
- **Real routes, not modals**, for every project and case study — they need to be shareable links.
- **Respect `prefers-reduced-motion`** for the hero and any other significant animation — show a static fallback (e.g. the hero's final motif frame) rather than skipping the check.
- **Mobile-first for `/studio`** specifically — test and tune there before desktop. Particle density in the hero should scale down on mobile for performance, not just aesthetics.

## Open Decisions

Things that are genuinely unresolved — ask rather than assuming an answer:

- Contact tool: Resend vs. Cal.com
- Exact typography (current `DESIGN.md` typography section is a proposal, not locked)
- Final shape/parameters of the hero's abstract motif
- Landing page copy (soft-split framing) and contact page intent wording

## Design System

**`DESIGN.md` is the source of truth for all visual decisions** — read it before implementing any component. Don't duplicate its content here; if something in this file and `DESIGN.md` ever conflict, treat that as a bug and flag it rather than picking one silently.

Quick color reference (see `DESIGN.md` for full rationale and usage rules):
```
bg: #0a0b0c          bg-elevated: #121414     bg-hover: #16201a
border: #1c1f1d      green: #39ff88           green-dim: #1c5c3a
text: #e8efe9         text-dim: #8a9590
```