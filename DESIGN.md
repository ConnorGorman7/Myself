# DESIGN.md — connorgorman.ca

A dual-audience portfolio: a public, personality-forward career side (`/work`)
and a results-first client pitch side (`/studio`), sharing one visual system.

> Sections marked **(proposed)** extend beyond what's been explicitly locked
> in and reflect a reasonable default given everything else here — swap freely.

---

## 1. Visual Theme & Atmosphere

Dark, near-black canvas with a single green accent — the "computer engineer
terminal" instinct, deliberately broadened so it reads as *technical and
intentional* rather than literally a terminal window. The mood is quiet
confidence: low-light, high-contrast, nothing decorative competing with the
accent color.

The site should feel like one person built it carefully, not like a template.
Personality shows up in motion and copy, not in extra ornament — the
hero's particle morph and the soft landing-page split are the personality;
everything downstream of that should be calm and legible.

`/work` can afford more visual play (it's a portfolio — recruiters expect to
be shown something). `/studio` should feel closer to a tools dashboard than a
portfolio: fewer animations, faster to scan, proof and contact visible
without scrolling.

---

## 2. Color Palette & Roles

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#0a0b0c` | Page background |
| `--bg-elevated` | `#121414` | Cards, panels, the hero stage frame |
| `--bg-hover` | `#16201a` | Hover state for dark surfaces (buttons, list rows) |
| `--border` | `#1c1f1d` | Default hairline borders on dark surfaces |
| `--green` | `#0B6623` | Primary accent — CTAs, links, active states, hero particles at full brightness |
| `--green-dim` | `#1c5c3a` | Secondary accent — borders, dividers, inactive/idle states |
| `--text` | `#e8efe9` | Primary text on dark backgrounds |
| `--text-dim` | `#8a9590` | Secondary/muted text, labels, captions |

Rules:
- Green is the *only* accent color in the system. No second accent, no
  gradients between unrelated hues — if something needs a second tone, it's
  a luminance step of green (`--green` → `--green-dim`), not a new color.
- Green is used sparingly outside the hero and CTAs. A page that's all green
  text defeats the point of having an accent at all.
- Never place full-saturation `--green` text on `--bg-elevated` for body
  copy — reserve it for short, important strings (labels, links, numbers).

---

## 3. Typography Rules **(proposed)**

Not yet locked — this is a starting point, not a decision made in prior
conversation. The instinct: a clean grotesk for everything readable, with a
monospace used sparingly as a *technical accent*, not as the whole identity
(the broadened hero motif applies here too — nod to "engineer," don't shout it).

| Use | Family | Notes |
|---|---|---|
| Headings / hero name | A geometric or grotesk sans (e.g. Geist, General Sans, or Switzer) | Avoid Inter/Roboto/Arial — overused, reads as default-AI-output |
| Body | Same family as headings, regular weight | One typeface family, weight does the work |
| Labels, stage indicators, code-adjacent UI (nav items, tags, the hero's "stage: photo" label) | A monospace (e.g. JetBrains Mono, IBM Plex Mono) | This is the one place "engineer" shows up literally |

| Level | Size (desktop) | Weight |
|---|---|---|
| Hero name | 56–72px | 700 |
| Hero tagline | 18–20px | 500, monospace, letter-spacing 0.05em |
| H1 (page) | 36–44px | 700 |
| H2 (section) | 24–28px | 600 |
| Body | 16px | 400 |
| Caption / meta | 12–13px | 500, monospace, uppercase, letter-spacing 0.08em |

---

## 4. Component Stylings

**Buttons**
- Default: `--bg-elevated` fill, `--green-dim` border, `--green` text.
- Hover: fill steps to `--bg-hover`, border steps to `--green`.
- Disabled: opacity 0.4, no hover transition.

**Project / case-study cards** (`/work`, `/studio`)
- Real routes, not modals — each card uses a shared `layoutId` (Framer
  Motion) so clicking morphs into the full project page rather than
  cutting away. This only needs to work going *into* the route, not back.
- Card surface: `--bg-elevated`, `--border` hairline, no shadow (see §6).

**Contact intents** (`/contact`)
- 2–3 large clickable cards, not a single generic form — each routes to a
  different flow (e.g. "hire me for a project," "I have an idea," "just
  want to say hi"). Each intent should read as a distinct destination, not
  a styled radio button.

**Hero stage**
- A bordered, slightly-elevated frame (`--bg-elevated`, `--border`,
  1px radius ~6px) containing the particle canvas — the frame itself is the
  one place a subtle radial gradient is allowed (`--bg-elevated` center to
  near-`--bg` edge), to give the particles somewhere to glow against.

---

## 5. Layout Principles

- **Soft split, not a hard toggle.** The landing page offers two paths
  ("see what I'm building" → `/work`, "work with me" → `/studio`) as a
  choice within one page, not a literal switch/toggle UI.
- **One signature screen first.** Before extending the visual language
  broadly, get one screen exactly right and let everything else extend from
  it. For this project that's the hero; for SweatTax it was the pact result
  screen — same principle, invest depth before breadth.
- Spacing scale: 4px base unit, standard steps 4/8/12/16/24/32/48/64.
- `/work` can use a denser grid (visual-resume feel); `/studio` should have
  more whitespace and a single clear vertical path toward contact.
- No blog section, anywhere — that's intentionally handled by socials.

---

## 6. Depth & Elevation

On a near-black palette, conventional drop shadows barely register — depth
here comes from **border + subtle glow**, not shadow stacking.

- Resting surface: `--border` hairline only, no shadow.
- Elevated/focused surface (hero frame, active card): hairline border in
  `--green-dim` instead of `--border`, optionally a faint radial glow
  behind it using `--green` at very low opacity (≤8%).
- Never stack more than two elevation steps — if something needs a third
  level of "lifted," the layout has a hierarchy problem, not a styling one.

---

## 7. Do's and Don'ts

**Do**
- Keep the entire UI to background + one accent. Resist adding a second
  "friendly" color even for things like success/error states — use
  brightness/saturation steps of green, or text alone, instead.
- Use real routes for every project and case study so links are shareable
  to a specific recruiter or client.
- Test `/studio` on mobile first — it's the page most likely opened
  mid-conversation on a phone.

**Don't**
- Don't use a `cover`-style fit for anything that needs to stay fully
  legible (text, the hero name, key diagrams) — it crops whatever doesn't
  fit the frame. Use `contain` for content that must never be cropped, and
  reserve `cover` for things meant to fill a frame (photos, background art).
  This came up directly in building the hero animation and is a good
  general rule for this system.
- Don't let `/studio` look like a portfolio. Fewer animations, demo content
  above the fold, contact clearly visible — it should feel closer to a
  product dashboard than `/work`.
- Don't introduce Inter, Roboto, Arial, or a generic purple gradient — the
  fastest way for this to read as templated AI output.
- Don't add peer-to-peer or monetary UI patterns anywhere on the site
  (carried over from the SweatTax decision to avoid that licensing
  surface — not directly relevant here, but the instinct to avoid scope
  creep into financial features applies broadly).

---

## 8. Responsive Behavior

- Breakpoints: mobile <640px, tablet 640–1024px, desktop >1024px.
- `/studio` is mobile-first in testing order — verify there before desktop.
- Touch targets: minimum 44px, generous spacing between contact intents on
  mobile so mis-taps don't route to the wrong flow.
- Hero particle density should scale down on mobile (lower target particle
  count) — this is a performance requirement, not just a visual one; dense
  particle counts that are fine on desktop will visibly chug on a
  mid-range phone.
- Nav collapses to a minimal mobile pattern; given there's no blog and a
  small number of top-level routes (`/work`, `/studio`, `/contact`), avoid
  a heavy hamburger-menu pattern if a simpler persistent layout will do.

---

## 9. Agent Prompt Guide

**Quick reference**
```
bg: #0a0b0c        bg-elevated: #121414     bg-hover: #16201a
border: #1c1f1d    green: #0B6623           green-dim: #1c5c3a
text: #e8efe9      text-dim: #8a9590
```

**Ready-to-use prompts**
- "Using DESIGN.md, build the `/work` project grid — visual-resume feel,
  denser spacing than `/studio`, each card using a shared layoutId for the
  morph into its project page."
- "Using DESIGN.md, build the `/studio` page — results-first, fewer
  animations than `/work`, demo embed above the fold, contact visibly
  reachable without scrolling."
- "Using DESIGN.md, build the `/contact` page with 2–3 clickable intent
  cards instead of a single form."
- "Using DESIGN.md and the hero pixel-morph prototype in
  `prototypes/hero-pixel-morph.html`, port the animation into a React
  component for the landing page hero, respecting `prefers-reduced-motion`."