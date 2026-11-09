# Setting up a new client site

Start by clicking **Use this template** on GitHub — do not fork, and do not clone
and re-point the remote. You want a fresh history per client.

Then work down this list. It replaces a setup script deliberately: a script
rots between projects, a checklist does not.

---

## 1. Rename and install

- [ ] `apps/site/package.json` → `name`
- [ ] Leave `packages/ui` named `@flaviocodes/sfoglia-ui`. Every client keeps the
      same import paths, so a fix in the template ports by copying the file
      instead of rewriting imports in a dozen places.
- [ ] Note the sfoglia commit you started from in the client README, as the
      base for the next sync
- [ ] `npm install`
- [ ] `npm run dev` → <http://localhost:4321/de/> should render

## 2. Decide the locales — do this before writing any content

The template ships **DE + EN**. Retrofitting a second language is painful;
removing one is trivial. So: keep both if there is any chance the client wants a
second language, and delete one only when you are sure.

To remove or add a locale:
- [ ] `apps/site/src/i18n/config.ts` → edit `LOCALES` (and `LOCALE_NAMES`)
- [ ] `apps/site/src/i18n/<locale>.json` → delete, or copy `de.json` and translate
- [ ] the `<locale>/` folder inside each `apps/site/src/content/*/`
- [ ] `npm run typecheck` → every remaining per-locale table (`t.ts`
      dictionaries, legal page copy, day names) is typed against `LOCALES`
      and fails until it matches

Keystatic builds its per-locale collections from `LOCALES`, so it needs no edit.

## 3. Theme the site

This is where the visual identity actually happens.

- [ ] `packages/ui/src/tokens/theme.css` → change the `--_brand-*` ramp hue, the
      neutrals, `--font-sans` / `--font-display` / `--font-body`, and the radii
- [ ] Re-derive the dark-mode `--color-accent-soft` in `theme.css` (it is a
      literal, not a ramp step) and the two `theme-color` hexes in
      `apps/site/src/components/BaseHead.astro` (meta tags cannot read tokens)
- [ ] Swap the fonts: `npm i @fontsource-variable/<family>` in `packages/ui`,
      then update the `@import` lines in `packages/ui/src/styles/global.css` and
      the family names in `theme.css`
- [ ] `npm run storybook` → check every component in **light and dark**
- [ ] <http://localhost:4321/styleguide> → check the sections in context
- [ ] Optional, when the client can't name a look: send them
      `/styleguide?direction=<a-o>` (arrow keys cycle). The catalog lives in
      `packages/ui/src/tokens/theme-directions.css`, loaded only by the
      styleguide. Ask colour (the direction) and shape (button shape/shadow,
      eyebrow, heading decoration, photo treatment, depth, border weight,
      heading face) as separate questions, then fold the winning *values* into
      `theme.css` / `client.css` and drop the import once they have picked.

Never write a raw colour or size outside `theme.css`. If you need one, add a
role.

## 4. Business details and content

- [ ] `apps/site/src/data/site.json` — name, address, phone, email, opening hours,
      socials, and `schemaType`: the schema.org type (`Dentist`, `Restaurant` …,
      or `Person` for an individual with no premises — then set `jobTitle`)
- [ ] `apps/site/src/content/**` — replace the sample content
- [ ] Optional sections — `Cta`, `Stats`, `Pricing` and `Team` in
      `apps/site/src/sections/` are not on the homepage by default; they all
      render nothing when their collection is empty. Add the ones the client
      needs to `pages/[locale]/index.astro` (see `/styleguide` for each), and
      delete the sample `content/pricing` and `content/stats` entries of the
      ones you skip. `Pricing` has two layouts: `variant="tiers"` (packages) or
      `variant="list"` (menu-style, grouped by each entry's `group`)
- [ ] `apps/site/public/favicon.svg`
- [ ] `uid` in `site.json` — only if the client is in the Handelsregister;
      empty hides the Impressum block. Never invent one.
- [ ] `apps/site/src/pages/[locale]/datenschutz.astro` — read it end to end; it
      describes how *this* stack behaves, so any third-party embed you add makes
      it wrong

## 5. Domain and URLs

- [ ] `apps/site/astro.config.mjs` → `site: 'https://<client-domain>'`
      (required — sitemap and OG tags use absolute URLs)
- [ ] `apps/site/public/robots.txt` → the `Sitemap:` line

## 6. Cloudflare — two Workers from one repo

Both are Cloudflare Workers connected through **Workers Builds** (Workers & Pages →
Create → Import a repository). Root directory is the repo root for both; Node is
pinned by `.nvmrc`. Set the **production branch to `release`**: the manual Release
workflow fast-forwards it, so merging to `main` does not ship.

**Worker 1 — the client site** (`apps/site/wrangler.jsonc`)
- [ ] Build command: `npm run build --workspace=apps/site`
- [ ] Deploy command: `cd apps/site && npx wrangler deploy`
- [ ] Rename `name` in `apps/site/wrangler.jsonc` to the client
- [ ] Custom domain — pick one:
  - **The client's DNS moves to Cloudflare** (nameservers): add it as a Custom
    Domain on the Worker. Before switching nameservers, copy **every** existing
    record into Cloudflare, above all the MX/SPF/DKIM records, or their email stops.
  - **The client's DNS stays where it is**: a Workers Custom Domain needs the zone
    on Cloudflare, so use a Cloudflare for SaaS custom hostname on your own zone
    (100 free) and have the client add the CNAME + validation records it shows.
    Not tried yet on a client; verify on the first one.

**Worker 2 — Storybook** (optional, but it is your portfolio piece; `packages/ui/wrangler.jsonc`)
- [ ] Build command: `npm run build-storybook`
- [ ] Deploy command: `cd packages/ui && npx wrangler deploy`

Turn on builds for non-production branches: every pull request then gets a
preview URL, which is how you get sign-off — "does this look right?" beats a
screenshot. `npx wrangler dev` (in `apps/site`, after a build) runs the real
Worker locally, including Keystatic and `/api/contact`; local secrets go in
`apps/site/.dev.vars` (gitignored).

## 6b. Contact form — form or mailto

`contactMode` in `site.json` (Keystatic: Grunddaten → Kontakt) picks one:

- **`mailto`**: a mailto button to `email`. Nothing to set up and no form mail
  passes through any service. The Datenschutz text adapts on its own.
- **`form`** (default): the form posts to `/api/contact`, which mails it through
  [Lettermint](https://lettermint.co) (EU-only processing; free up to 300 emails a
  month) with the visitor as Reply-To. Spam protection is a honeypot field.
  - [ ] One Lettermint project for all client sites, sending from your own
        domain (e.g. `forms@forms.<your-domain>`): verify that domain in
        Lettermint by adding the DNS records it shows. Client domains are not touched.
  - [ ] Worker secrets (Settings → Variables and Secrets):
        `LETTERMINT_PROJECT_TOKEN`, `CONTACT_FROM_EMAIL` (that sender address),
        `CONTACT_TO_EMAIL` (the client's inbox)
  - [ ] Send one test message from the preview URL before handover

## 7. Keystatic — connect the client's login

In development Keystatic runs in **local mode**: `/keystatic` writes straight to
your filesystem, no login. Production uses **GitHub mode**, which needs a GitHub
App — once per repo, about five minutes.

- [ ] Open `/keystatic` on the deployed site; it walks you through creating the app
- [ ] Set `repo` in `apps/site/keystatic.config.ts` to the client's repo. Keep
      `pathPrefix: 'apps/site/'` — without it every collection reads as empty
      in production
- [ ] Add the env vars Keystatic gives you as secrets on the site's Worker:
      `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
      `KEYSTATIC_SECRET`
- [ ] Invite the client to the repo (they need a GitHub account — see
      `docs/01-discovery-questionnaire.md`, this is worth raising early)
- [ ] Have them log in and make one real edit before handover

## 8. Analytics — only if asked

Off by default, and that is usually the right answer.

- [ ] To enable: Cloudflare dashboard → Web Analytics → add the site → paste the
      token into `analytics.cloudflareToken` in `site.json`
- [ ] It is cookieless, so **no consent banner is needed** — but the
      Datenschutzerklärung then needs its analytics section, which the page
      renders automatically once the token is set

## 9. Before you call it done

- [ ] `npm run check` — lint and format
- [ ] `npm run typecheck` — TS + Astro
- [ ] `npx playwright test` — smoke suite
- [ ] Lighthouse on the deploy preview: performance and accessibility ≥ 95
- [ ] Open the site on a real phone
- [ ] Send the client `docs/03-handover.md`, filled in
