# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A template repo for small client websites (one-pagers/brochure sites, DE+EN)
that gets used via GitHub's "Use this template", then customized per client
following `SETUP.md`. It is not itself a client site — changes here should
stay generic/template-shaped unless explicitly working on a specific client
instantiation.

Two npm workspaces:

```
packages/ui/     design tokens, Vue components, Storybook   → deployable on its own
apps/site/       the Astro site + Keystatic admin           → the client's site
docs/            client-facing documents (discovery, legal, handover)
```

## Commands

```bash
npm install
npm run dev                       # apps/site            → localhost:4321/de/
npm run storybook                 # packages/ui           → localhost:6006
npm run check                     # biome lint + format (whole repo)
npm run check:fix                 # biome, auto-fix
npm run typecheck                 # astro check + vue-tsc across workspaces
npm run build                     # build all workspaces
npx playwright test                # smoke suite (builds apps/site first, see below)
npx playwright test tests/smoke.spec.ts -g "<title>"   # single test
```

Playwright's `webServer` runs `npm run build --workspace=apps/site` then serves
the built `dist/` via `tests/static-server.mjs` — it tests the production
build, not the dev server, so build-time regressions (tree-shaking, image
pipeline, routing) get caught. Locally it reuses an already-running server; CI
always rebuilds.

lefthook runs `biome check --write` and `npm run typecheck` on staged
`.{js,ts,jsx,tsx,json,jsonc,css,astro}` files pre-commit.

## Architecture and why it's built this way

**No standing infrastructure.** Content lives as Markdoc + YAML in the repo,
edited through Keystatic (commits via GitHub — no DB, no CMS server). In dev,
Keystatic runs in local mode (writes straight to the filesystem, no login); in
production it needs a GitHub App (client's login, see `SETUP.md` step 7).

**Static HTML first.** Astro renders every page to HTML at build time,
including Vue components — server-rendered then hydrated as islands, so
content is crawlable. The nav hydrates eagerly (`client:load`, above the
fold); everything else waits for `client:visible`.

**Tokens are the product.** `packages/ui/src/tokens/theme.css` holds
role-based custom properties (`--color-surface`, never `--blue-500`). Nothing
else in the codebase names a raw colour or size — re-theming a client site
means editing this one file, and dark mode is free because roles are semantic.

**No cookies, no banner by default.** Self-hosted fonts, cookieless analytics
(off unless configured in `site.json`), no third-party scripts. The smoke
suite asserts the homepage makes zero external requests.

**Two "Storybooks," two audiences.** Storybook (`packages/ui`) is the dev
environment for the Vue layer. `/styleguide` on the Astro site is the
client-facing equivalent — same tokens, real Astro sections, in context.

## i18n

`apps/site/src/i18n/config.ts` is the single source of truth. Per-locale
tables elsewhere (`t.ts` dictionaries, legal page copy, day names) are typed
`Record<Locale, …>`, so changing `LOCALES` fails `astro check` until they
match; `netlify.toml`'s `/` redirects are the one untyped list. `LOCALES` currently ships `['de', 'en']`
with `de` as default. Routing uses `prefixDefaultLocale: true` with Astro's
i18n `routing: 'manual'`, because Astro's automatic i18n middleware would 404
every non-locale route including Keystatic's admin —
`apps/site/src/middleware.ts` re-applies the stock middleware with an
exception for `/keystatic` and other non-localized routes. When touching
routing or adding pages, check this middleware.

## Known sharp edges

- **Two content schemas.** `apps/site/src/content.config.ts` (Zod, validates
  at build) and `apps/site/keystatic.config.ts` (the editor form that writes
  the files) must change together. Keystatic saves untouched text fields as
  `''`, so optional Zod fields must accept an empty string. The same goes for
  the `settings` singleton and `src/data/site.json`: a key missing from the
  singleton schema is dropped the first time the client saves.

- **Vue/React Fast Refresh conflict.** React exists only for the Keystatic
  admin. `@vitejs/plugin-react`'s Fast Refresh transform runs over `.vue`
  files too unless excluded, injecting `$RefreshSig$` and making `astro dev`
  500 on any page using a Vue component (production build stays green — only
  breaks in dev). Guarded by `react({ exclude: ['**/*.vue'] })` in
  `astro.config.mjs`. The other half of the guard: **never call a Vue
  composable named `use*` at the top level of an SFC** — Fast Refresh's
  heuristic treats any `use*` call as a React hook. This is why
  `FaqAccordion.vue` uses a plain array ref instead of `useTemplateRef`.
- **Biome does not lint `.astro` files** — it only parses frontmatter and
  would report template-used imports as unused, so `.astro` is excluded
  entirely in `biome.json`; `astro check` (via `npm run typecheck`) covers it.
  For `.vue`, Biome parses `<script>` but not `<template>`, so
  `noUnusedVariables`/`noUnusedImports` are disabled for `.vue` in
  `biome.json` — `vue-tsc` is the real check there.
- **TypeScript is pinned to `^5.9`** — TS 7 breaks `@astrojs/netlify`'s
  dependency chain. Don't bump the major without checking that adapter.
- **`npm audit` reports findings from `@astrojs/netlify`'s local-emulation
  chain** (`ipx`, `sharp`, `extract-zip`, `image-size` via `@netlify/dev`) —
  none of it ships to browsers. Don't run `npm audit fix --force`; it
  downgrades the adapter across a major and breaks the build. Re-check with
  `npm audit --omit=dev` after adapter upgrades instead.

## Working across the two workspaces

`packages/ui` is deployable and testable standalone (its own Storybook,
Netlify site, `typecheck` script). `apps/site` depends on it as a workspace
package (imported via `@flaviocodes/sfoglia-ui`'s exports:
`.`, `./components/*`, `./styles/*`, `./tokens/*`). When changing a shared
component or token, verify both the Storybook story and the real usage in
`apps/site` (dev server + `/styleguide`).
