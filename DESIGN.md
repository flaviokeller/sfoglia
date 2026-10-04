---
name: sfoglia
description: One thin, well-made base layer that every client site rolls out in its own way.
colors:
  brand-accent: "oklch(50% 0.18 250)"
  brand-accent-hover: "oklch(42% 0.15 250)"
  brand-accent-active: "oklch(34% 0.11 250)"
  brand-accent-soft: "oklch(97% 0.02 250)"
  brand-accent-text: "oklch(42% 0.15 250)"
  focus-ring: "oklch(58% 0.19 250)"
  canvas: "oklch(100% 0 0)"
  surface: "oklch(98% 0.004 250)"
  surface-raised: "oklch(100% 0 0)"
  surface-sunken: "oklch(96% 0.006 250)"
  surface-inverted: "oklch(19% 0.006 250)"
  ink: "oklch(19% 0.006 250)"
  ink-muted: "oklch(48% 0.012 250)"
  ink-subtle: "oklch(58% 0.012 250)"
  border: "oklch(92% 0.008 250)"
  border-strong: "oklch(86% 0.01 250)"
  success: "oklch(58% 0.15 150)"
  success-surface: "oklch(95% 0.04 150)"
  danger: "oklch(56% 0.19 27)"
  danger-surface: "oklch(95% 0.04 27)"
typography:
  display:
    fontFamily: "Fraunces Variable, ui-serif, Georgia, Times New Roman, serif"
    fontSize: "clamp(2.4rem, 1.85rem + 2.75vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fraunces Variable, ui-serif, Georgia, Times New Roman, serif"
    fontSize: "clamp(2rem, 1.65rem + 1.75vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Fraunces Variable, ui-serif, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.65rem, 1.45rem + 1vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title-sm:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.06rem + 0.33vw, 1.375rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  lead:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.06rem + 0.33vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.875rem, 0.85rem + 0.12vw, 0.95rem)"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: "0.04em"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
  lg: "0.875rem"
  xl: "1.25rem"
  full: "9999px"
spacing:
  3xs: "0.125rem"
  2xs: "0.25rem"
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
  4xl: "6rem"
  section: "clamp(3rem, 2rem + 5vw, 7rem)"
  gutter: "clamp(1rem, 0.5rem + 2.5vw, 2.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.brand-accent}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.brand-accent-hover}"
  button-primary-active:
    backgroundColor: "{colors.brand-accent-active}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
  button-secondary-hover:
    textColor: "{colors.brand-accent-text}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.brand-accent-text}"
    rounded: "{rounded.md}"
    padding: "0.75rem 0.75rem"
  button-ghost-hover:
    backgroundColor: "{colors.brand-accent-soft}"
  card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
  badge:
    backgroundColor: "{colors.brand-accent-soft}"
    textColor: "{colors.brand-accent-text}"
    rounded: "{rounded.full}"
    padding: "0.125rem 0.5rem"
  nav-link:
    textColor: "{colors.ink}"
    padding: "0.25rem 0"
  nav-link-active:
    textColor: "{colors.brand-accent-text}"
---

# Design System: sfoglia

## Overview

**Creative North Star: "The Fresh Sheet"**

Sfoglia is the thin sheet of pasta every cook rolls out differently. This system
is that sheet: one well-made base layer, even in thickness and quietly
finished, that each client rolls out with their own colour, fonts and photos.
The craft is in its proportions: a fluid type scale, steady section rhythm,
semantic roles and honest states. It is not a signature look. Swap the
brand hue and fonts in `packages/ui/src/tokens/theme.css` and the whole site
moves with them.

The feel is warm and approachable: a local business, not a software product. A
soft variable serif (Fraunces) carries headings and quotes, and a plain humanist
sans (Inter) carries everything you read or tap. Corners are gently rounded,
greys lean faintly toward the brand hue so they never feel clinical, and the
page is calm. A single accent marks the action; everything else is ink, paper
and a hairline border.

The layer must survive its editor. A non-technical client will add long German
compound words, odd photo ratios and skipped optional fields, so layouts flow
rather than lock: grids auto-fit, type is fluid, and content dictates height.
Dark mode is not a second design. It is the same roles remapped.

**Key Characteristics:**
- One brand hue as a swappable OKLCH ramp; everything downstream uses semantic roles.
- Serif display over sans body, both fluid (`clamp()`), with no type breakpoints.
- Flat, bordered surfaces; shadow only as a response to interaction or overlay.
- Intrinsic layout: auto-fit grids, one media query in the whole system.
- Light DOM components, styled by the same global tokens, readable before hydration.

## Colors

A single cool brand accent over tinted paper neutrals. It is a placeholder that
waits for a client's colour, so the system never depends on what that colour is.

### Primary
- **Brand Accent** (`brand-accent`): the slot each client fills. It is used
  on primary buttons, the active nav underline, input hover borders and the
  focus ring's family. Its text-safe variant (`brand-accent-text`, one step
  darker) is the only accent allowed on running text, links and eyebrows. The
  soft tint (`brand-accent-soft`) backs badges and ghost-button hovers.

### Neutral
- **Canvas / Raised Paper** (`canvas`, `surface-raised`): pure white page and
  card faces.
- **Tinted Paper** (`surface`): the alternate section band, barely off-white
  with a brand-hued lean.
- **Sunken Paper** (`surface-sunken`): image placeholders, neutral badges and
  the deepest band.
- **Ink** (`ink`): headings and body text. It is not pure black; it carries the
  same faint brand hue.
- **Muted / Subtle Ink** (`ink-muted`, `ink-subtle`): leads, card summaries,
  hints, placeholders.
- **Hairline / Strong Hairline** (`border`, `border-strong`): card edges,
  dividers, field strokes.

### Status
- **Success** and **Danger**, each with a soft surface, are used only for form
  feedback and the success badge.

### Named Rules
**The Roles-Only Rule.** Nothing outside `theme.css` names a raw colour. A
component that needs a new colour gets a new role in `theme.css`, never a hex
inline.

**The Text-Safe Accent Rule.** Running text, links and small labels use
`brand-accent-text`, never `brand-accent`. After any re-theme, re-check contrast
on both, in light and dark mode.

**The One Hue Rule.** The template ships one brand hue. Secondary and tertiary
accents arrive only with a client who actually has them.

## Typography

**Display Font:** Fraunces Variable (with ui-serif, Georgia)
**Body Font:** Inter Variable (with ui-sans-serif, system-ui)
**Label/Mono Font:** ui-monospace, used only for incidental code

**Character:** a soft, slightly old-fashioned serif for the voice of the
business, set over a neutral sans that disappears into reading. Both fonts are
self-hosted via Fontsource, and a client re-theme swaps them in two lines.

### Hierarchy
- **Display** (600, `--text-4xl`, 1.1, −0.02em): the hero title only, once per page.
- **Headline** (600, `--text-3xl`, 1.1): page-level h1 when there is no hero.
- **Title** (600, `--text-2xl`, 1.1): section headings (h2).
- **Title, small** (600, `--text-lg`, 1.3): card and item headings (h4). This
  is the one heading that switches to the sans, so dense card grids stay calm.
- **Lead** (400, `--text-lg`, 1.75, muted): the paragraph under a section
  title, capped at 65ch.
- **Body** (400, `--text-base`, 1.6): everything else; prose capped at 42rem.
- **Label / Eyebrow** (600, `--text-sm`, +0.04em, uppercase, accent text): a
  short tag above a heading. It is optional and must still work when the editor
  leaves it blank.

The scale is a major third (~1.25) on mobile, widening to ~1.333 on desktop,
all through `clamp()`.

### Named Rules
**The Fluid-Only Rule.** Type never changes size at a breakpoint. If a size
looks wrong at some width, fix the `clamp()`, don't add a media query.

**The Serif-for-Voice Rule.** Fraunces is for headings and testimonial quotes,
the moments the business speaks. UI chrome, forms and body copy stay in the
sans.

## Layout

The layout is intrinsic, not breakpoint-driven. Content sits in a centred
`.container` capped at 72rem with a fluid gutter (1rem → 2.5rem). Prose is
capped at 42rem and leads at 65ch. Sections stack with fluid vertical padding
(3rem → 7rem) and alternate between canvas, tinted paper and sunken paper
bands to separate content without rules or boxes.

Grids use `repeat(auto-fit, minmax(min(18rem, 100%), 1fr))` (24rem for
two-up), so they collapse on their own as space runs out. Vertical rhythm
inside a block comes from the `.stack` owl selector (`--flow-space`, default
1rem). Spacing follows a 4px-based scale from `3xs` (2px) to `4xl` (96px).

The only media query in the system is the nav at `48rem`, where the inline bar
becomes a slide-in drawer. A drawer is a genuinely different layout, not a
resized one.

### Named Rules
**The One Media Query Rule.** New layout behaviour reaches for auto-fit grids,
`min()`, `clamp()` and container sizing first. A media query needs a reason as
good as the nav drawer's.

**The Editor-Proof Rule.** No fixed heights on content. Cards stretch to the
tallest sibling, images keep their own ratio or crop with `object-fit`, and every
optional field can be absent without leaving a hole.

## Elevation & Depth

Flat by default. Depth comes from tonal section bands and 1px hairline borders,
not shadows. Three soft, two-layer shadows exist (`--shadow-sm`, `--shadow-md`,
`--shadow-lg`) and are heavier in dark mode so they still read. They are
reserved for state and overlay: `md` lifts an interactive card on hover (with a
2px rise), and `lg` sits under the mobile nav drawer.

### Named Rules
**The Flat-At-Rest Rule.** Nothing casts a shadow while idle. A shadow means
"this responds to you" or "this sits above the page".

## Shapes

Gently rounded, never pill-heavy. Controls and images use 0.5rem (`md`), cards
use 0.875rem (`lg`), and only badges and lightbox icon buttons are full pills.
The focus ring carries a small 0.25rem radius so it hugs whatever it outlines.
Borders are always 1px and always a role colour. Photos are cropped to 4:3 in the
gallery and to their natural ratio elsewhere.

## Components

All stateful components (nav, contact form, FAQ accordion, gallery) are Vue
islands rendered to light DOM. Their styles live in `styles/components.css` on
the same tokens, so they are crawlable and styled before hydration. Every one
needs a working no-JS fallback.

### Buttons
- **Shape:** gently rounded (`rounded.md`), 1px border slot.
- **Primary:** brand accent fill, white text, medium weight. Hover darkens one
  ramp step and active darkens two.
- **Secondary:** transparent with a strong hairline. Hover tints the border and
  text to the accent.
- **Ghost:** accent text, no border; hover lays down the soft accent tint.
- **Sizes:** `--sm` and `--lg`. The hero uses `--lg` for both CTAs.
- **Disabled:** 55% opacity with a not-allowed cursor.
- **Focus:** the global 2px focus-ring outline at 2px offset; no per-button override.

### Cards / Containers
- **Corner Style:** `rounded.lg`.
- **Background:** raised paper on a 1px hairline.
- **Shadow Strategy:** none at rest. `--interactive` adds the strong border,
  `--shadow-md` and a 2px lift on hover. The whole card becomes the hit area
  via a stretched link.
- **Internal Padding:** `spacing.lg`, with a `sm` gap between children.

### Badges
- Pill-shaped and small (`--text-xs`, medium weight). Default is accent-soft with
  accent text; `--neutral` and `--success` variants exist.

### Inputs / Fields
- **Style:** raised paper, 1px strong hairline, `rounded.md`, base text size.
  Labels sit above in small medium-weight text; hints are muted.
- **Hover:** border shifts to the accent.
- **Focus:** the global focus ring.
- **Error:** `aria-invalid` turns the border danger-red, with a danger-coloured
  message under the field. Form-level status uses a soft success or danger panel.

### Navigation
- Inline links in medium-weight ink. Hover turns them accent text; the current
  page gets accent text plus a 2px accent underline (`aria-current`).
- Below 48rem, a toggle opens a right-side drawer (max 20rem) on raised paper,
  with `--shadow-lg`, a 40% black backdrop and a slide-in using `--ease-out`.
  Drawer links step up to `--text-lg`.

### FAQ Accordion
- Hairline-ruled list. Each trigger is a full-width row in large medium-weight
  text, with a muted chevron that rotates 180° on open. Answers are muted and
  capped at 65ch.

### Gallery & Lightbox
- Auto-fill grid of 4:3 thumbnails on sunken paper. On hover the image eases to
  a 1.04 scale over `--duration-slow`. The lightbox is a native `<dialog>` with
  an 85% black backdrop, a contained image and round translucent white icon
  buttons for close and previous/next.

### Testimonials
- Cards with the quote set in the display serif at `--text-lg`, wrapped in
  generated curly quotes. The attribution is small and medium weight, with
  context muted after a middot.

## Do's and Don'ts

### Do:
- **Do** use only public roles (`--color-*`, `--text-*`, `--space-*`,
  `--radius-*`) outside `theme.css`.
- **Do** re-theme by changing the `--_brand-*` hue, the neutral tint, the two
  font families and the radii, then re-check contrast in both colour schemes.
- **Do** use `brand-accent-text` for any accent-coloured text, and keep
  `brand-accent` for fills and strokes.
- **Do** let grids auto-fit and type `clamp()`. Test every section with missing
  optional fields and a 30-character German compound in the title.
- **Do** keep the single global `:focus-visible` treatment (2px focus-ring
  outline, 2px offset).
- **Do** keep motion short (`--duration-fast` 120ms for colour, `--duration-base`
  220ms for movement) on `--ease-out`, and let `prefers-reduced-motion` switch it off.

### Don't:
- **Don't** write a raw colour, px size or font name in a component or section.
  Add a role to `theme.css` instead.
- **Don't** add a dark-mode token that has no light-mode counterpart. Dark mode
  only remaps existing roles.
- **Don't** give resting surfaces a shadow, or replace hairline borders with
  heavy outlines.
- **Don't** introduce a second accent hue, gradients or a decorative signature
  into the template. Identity belongs to the client fork.
- **Don't** add type breakpoints or new media queries where an intrinsic layout
  would do.
- **Don't** fix a content height, or design a section that breaks when an
  optional field is empty.
