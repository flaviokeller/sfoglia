// @ts-check
import markdoc from '@astrojs/markdoc';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import keystatic from '@keystatic/astro';
import { defineConfig } from 'astro/config';

import { DEFAULT_LOCALE, LOCALES } from './src/i18n/config.js';

/**
 * SETUP: change `site` to the client's production URL. It is required for
 * correct sitemap and canonical/OG absolute URLs.
 */
export default defineConfig({
  site: 'https://example.ch',

  // Static by default — every public page is prerendered HTML. The adapter exists
  // only so the Keystatic admin routes (which opt out via `prerender = false`)
  // can run on demand. No public page is server-rendered.
  output: 'static',
  adapter: netlify({
    // Netlify's dev emulation boots a Deno-based Edge Functions server, which
    // fails with an unhandled rejection when Deno is not installed. This project
    // has no netlify/edge-functions directory and uses none, so emulating them
    // is pure noise. Pages served fine regardless — this just silences it.
    devFeatures: {
      environmentVariables: false,
      images: true,
      edgeFunctions: false,
    },
  }),

  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    // 'manual' does NOT mean hand-rolled routing. It means Astro's i18n
    // middleware is not installed automatically, so we can apply it ourselves in
    // src/middleware.ts with a few exceptions. This is required: with the
    // automatic middleware and `prefixDefaultLocale: true`, every route outside
    // a locale prefix 404s — including Keystatic's admin UI at /keystatic.
    // The actual routing options live in src/middleware.ts.
    routing: 'manual',
  },

  integrations: [
    markdoc(),
    // Vue powers the site's interactive components; React exists only for the
    // Keystatic admin at /keystatic. Both renderers co-exist, but React's Fast
    // Refresh transform must be kept away from .vue files — otherwise `astro dev`
    // injects $RefreshSig$ into every SFC and every page 500s. The production
    // build is unaffected, so this only shows up in dev.
    vue(),
    react({ exclude: ['**/*.vue'] }),
    keystatic(),
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: Object.fromEntries(LOCALES.map((locale) => [locale, locale])),
      },
    }),
  ],

  image: {
    // Resize/convert at build time. Keeps runtime image services out of the picture.
    responsiveStyles: true,
  },

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    css: {
      transformer: 'lightningcss',
    },
  },
});
