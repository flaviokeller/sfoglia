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
- [ ] `apps/site/netlify.toml` → the `Language` redirect rules for `/`
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

Never write a raw colour or size outside `theme.css`. If you need one, add a
role.

## 4. Business details and content

- [ ] `apps/site/src/data/site.json` — name, address, phone, email, opening hours,
      socials, and `schemaType`: the schema.org type (`Dentist`, `Restaurant` …,
      or `Person` for an individual with no premises — then set `jobTitle`)
- [ ] `apps/site/src/content/**` — replace the sample content
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

## 6. Netlify — two sites from one repo

**Site 1 — the client site**
- [ ] New site from this repo
- [ ] **Base directory: `apps/site`** (this is what makes `apps/site/netlify.toml` apply)
- [ ] Deploy, then add the client's domain under Domain management
- [ ] At the client's **existing registrar**, add the `A`/`ALIAS` + `CNAME`
      records Netlify shows. Do **not** move the nameservers — that breaks their
      email (MX records).

**Site 2 — Storybook** (optional, but it is your portfolio piece)
- [ ] New site from the same repo
- [ ] **Base directory: `packages/ui`**

Deploy previews are on by default. The preview URL on a pull request is how you
get sign-off: "does this look right?" beats a screenshot.

## 7. Keystatic — connect the client's login

In development Keystatic runs in **local mode**: `/keystatic` writes straight to
your filesystem, no login. Production uses **GitHub mode**, which needs a GitHub
App — once per repo, about five minutes.

- [ ] Open `/keystatic` on the deployed site; it walks you through creating the app
- [ ] Set `repo` in `apps/site/keystatic.config.ts` to the client's repo. Keep
      `pathPrefix: 'apps/site/'` — without it every collection reads as empty
      in production
- [ ] Add the env vars Keystatic gives you to Netlify:
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
