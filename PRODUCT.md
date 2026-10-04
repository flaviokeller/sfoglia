# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences. When they conflict, the editor wins.

1. **The client-editor (primary).** A non-technical small-business owner, or a
   friend or relative of the builder, who opens the Keystatic admin once or
   twice a year to change opening hours, a team member, a service or a photo.
   They will upload unresized phone photos, type long names and skip optional
   fields. Every design must survive that content without the builder's help.
2. **The builder.** One developer who clicks "Use this template" for each new
   client, works through `SETUP.md`, re-themes `packages/ui/src/tokens/theme.css`,
   then hands the site over (`docs/03-handover.md`).
3. **The client's visitors.** Locals deciding whether to call, book, come by or
   use the contact form, in German or English, often on a phone.

## Product Purpose

sfoglia is a reusable template for small, bilingual (DE + EN) brochure sites and
one-pagers for Swiss small businesses. It exists so that a site handed over
years ago keeps working and stays editable with no standing infrastructure:
no database, no CMS server and no VPS. Success means the client can still make
their yearly edit without calling the builder, and the site looks intentional
after that edit.

## Positioning

A static Astro site whose content lives as Markdoc and YAML in the client's own
repo, edited through Keystatic commits. There is nothing running that can break,
and no cookies, so no consent banner by default. Re-theming a client means
editing one token file, because every colour and size is a semantic role.

## Operating Context

- Client discovery (`docs/01-discovery-questionnaire.md`), legal and privacy
  setup (`docs/02-legal-privacy-checklist.md`, covering Impressum, nDSG and
  Datenschutz) and handover (`docs/03-handover.md`) are part of the product.
- Editing happens in Keystatic at `/keystatic`. In production that requires the
  client to have a GitHub account.
- Hosting is Netlify. The site ships as static HTML and Vue islands.
- Two design-review surfaces: Storybook in `packages/ui` for the builder, and
  `/styleguide` on the site, which shows the client the real sections in context.

## Capabilities and Constraints

- Pages: home, Leistungen (services), Team, Kontakt (contact) with a thank-you
  page, Impressum, Datenschutz and 404, under `/de/` and `/en/`.
  Sections: Hero, ServiceGrid, TextImage, Testimonials, Faq, OpeningHours,
  ContactSection. Vue components: SiteNav, ContactForm, FaqAccordion,
  ImageGallery.
- Content collections: pages, services, team, FAQ and testimonials, one per
  locale. Business facts (name, address, phone, opening hours, analytics token)
  live in `apps/site/src/data/site.json`.
- Locales come only from `apps/site/src/i18n/config.ts`. A client may drop EN.
- No third-party requests from the homepage, enforced by the smoke suite. Fonts
  are self-hosted. Analytics are cookieless and off unless configured.
  Embeds (maps, video, booking, chat) are out of scope by default, because each
  one changes the privacy claims.
- Every component needs a working no-JS fallback.
- Raw colours and sizes appear only in `theme.css`. Dark mode comes from the
  semantic roles.

## Brand Commitments

The template has no client brand. The name "sfoglia" is internal. Each client
fork supplies its own identity through the token file, fonts and content.
Design here must stay generic and re-themeable rather than committing to one
client's look.

## Evidence on Hand

- Demo content is a fictional Zürich dental practice, "Praxis am See", with
  placeholder contact details. It is not a real client, and its testimonials and
  team are not evidence.
- No real testimonials, client logos, metrics or case studies exist. Do not
  invent them.

## Product Principles

1. **Survive the editor.** Layouts must hold up with missing optional fields,
   long German compounds, odd photo ratios and oversized uploads.
2. **Nothing to maintain.** Prefer static, dependency-light solutions over
   anything that needs a server, a key or an update to keep working.
3. **Re-theme from one file.** Design decisions go through semantic tokens so
   a new client is a token edit, not a component rewrite.
4. **Private by default.** No cookies, no third-party requests, and no feature
   that quietly forces a consent banner.
5. **Content first, generic shell.** The template provides structure and craft.
   Each client's identity arrives with the client.

## Accessibility & Inclusion

The target is WCAG 2.1 AA, even though it is rarely a legal duty for private
Swiss businesses. That means focus states, semantic landmarks, a skip link,
contrast-checked tokens (re-checked after every re-theme), keyboard-operable nav,
form and gallery, no clipping at 200% zoom, and required alt text on every image.
