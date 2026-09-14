# sfoglia

A template for small client websites — the kind you build for friends, family
and the occasional small business. One-pagers and brochure sites, in two
languages, that a non-technical person can edit a few times a year.

**Use this template** on GitHub, then work through [`SETUP.md`](./SETUP.md).

```
packages/ui/     design tokens, Vue components, Storybook   → deployable on its own
apps/site/       the Astro site + Keystatic admin           → the client's site
docs/            client-facing documents (see below)
```

```bash
npm install
npm run dev          # the site            → localhost:4321/de/
npm run storybook    # the design system   → localhost:6006
npm run check        # lint + format
npm run typecheck    # TS + Astro
npx playwright test  # smoke suite
```

## Why it is built this way

**No standing infrastructure.** Content is Markdoc and YAML files in the repo,
edited through [Keystatic](https://keystatic.com) which commits via GitHub.
There is no database, no CMS server, no VPS to patch. A site handed over three
years ago cannot break, because there is nothing running to break. The price is
that an editor needs a GitHub account — a one-time three-minute cost, paid only
by the clients who actually edit.

**Static HTML first.** Astro renders every public page to HTML at build time,
including the Vue components — they are server-rendered and then hydrated as
islands, so every word is in the source for crawlers. The public site ships
~33 kB gzipped, of which ~28 kB is the Vue runtime and ~4 kB is the four
components themselves. The nav hydrates eagerly (`client:load`) because it is
above the fold; everything else waits for `client:visible`.

**Tokens are the product.** [`packages/ui/src/tokens/theme.css`](./packages/ui/src/tokens/theme.css)
holds role-based custom properties — `--color-surface`, never `--blue-500`.
Nothing else in the codebase names a colour or a size. Re-theming a client site
means editing one file, and dark mode comes free because the roles are semantic.

**No cookies, no banner.** Self-hosted fonts, cookieless analytics (off by
default), no third-party scripts. A smoke test asserts the homepage makes zero
external requests, so this stays true rather than being an aspiration.

**Two Storybooks' worth of audience, two artifacts.** Storybook is the
development environment for the Vue layer. `/styleguide` is the client-facing
one: the same tokens and the real Astro sections, in context, on the real site.

## Documents for client work

| | |
| --- | --- |
| [`docs/01-discovery-questionnaire.md`](./docs/01-discovery-questionnaire.md) | Work through before the project — including who owns the domain, who pays, and what happens if you are unavailable |
| [`docs/02-legal-privacy-checklist.md`](./docs/02-legal-privacy-checklist.md) | Impressum, nDSG, and why there is no cookie banner |
| [`docs/03-handover.md`](./docs/03-handover.md) | Give to the client at launch — how to edit, the image size rule, the exit path |

## Notable constraints

- **Vue and React co-exist, but React's Fast Refresh must be fenced off.** React
  is present only for the Keystatic admin. `@vitejs/plugin-react` otherwise runs
  its Fast Refresh transform over `.vue` files and injects `$RefreshSig$`, making
  `astro dev` 500 on every page using a component — while the production build
  stays green, so it only appears in dev. Two things prevent it:
  `react({ exclude: ['**/*.vue'] })` in `astro.config.mjs`, and **never calling a
  Vue composable named `use*` at the top level of an SFC** — the Fast Refresh
  heuristic reads any `use*` call as a React hook. This is why
  `FaqAccordion.vue` uses a plain array ref rather than `useTemplateRef`.
- **Biome lints `.vue` but not `.astro`.** For `.vue` it parses the `<script>`
  block but not the `<template>`, so `noUnusedVariables` / `noUnusedImports` are
  disabled for those files in `biome.json`; `vue-tsc` resolves templates properly
  and is the real check. `.astro` is excluded from Biome entirely — `astro check`
  covers it.
- **i18n routing is `'manual'`.** With `prefixDefaultLocale: true`, Astro's
  automatic middleware 404s every non-locale route — including Keystatic's
  admin. [`src/middleware.ts`](./apps/site/src/middleware.ts) re-applies the
  stock middleware with exceptions.
- **TypeScript is pinned to 5.x.** TS 7 breaks the Netlify adapter's dependency
  chain.
- **`npm audit` reports 10 high findings.** All ten come from one chain:
  `@astrojs/netlify` → `@netlify/vite-plugin` → `@netlify/dev`, Netlify's local
  emulation stack (`ipx`, `sharp`, `extract-zip`, `image-size`). None of it is
  served to browsers — verified absent from the client bundles. `npm audit fix
  --force` would downgrade the adapter across a major version and break the
  build, so it is deliberately not applied. It clears when Netlify updates
  `@netlify/dev`; re-check with `npm audit --omit=dev` after adapter upgrades.
- **Biome does not lint `.astro` files.** It parses only the frontmatter and
  reports template-used imports as unused; `astro check` covers them instead.
