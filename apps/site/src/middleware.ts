import { middleware } from 'astro:i18n';
import { defineMiddleware } from 'astro:middleware';

/**
 * i18n routing, applied selectively.
 *
 * Astro's automatic i18n middleware, with `prefixDefaultLocale: true`, returns a
 * 404 for any route that is not under a locale prefix. That is correct for the
 * public site — every real page lives at /de/… or /en/… — but it also swallows
 * routes that are deliberately not localised:
 *
 *   /keystatic, /api/keystatic  the CMS admin UI and its API (injected by the
 *                               Keystatic integration; cannot be moved)
 *   /styleguide                 an internal design reference, not a public page
 *
 * So we switch `i18n.routing` to 'manual' in astro.config.mjs and re-apply the
 * stock middleware here for everything except those paths. The routing options
 * below must match what the config used to declare.
 */
const i18nMiddleware = middleware({
  prefixDefaultLocale: true,
  redirectToDefaultLocale: true,
  fallbackType: 'redirect',
});

/** Paths that must bypass locale routing entirely. */
const UNLOCALISED = ['/keystatic', '/api/keystatic', '/styleguide'];

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  if (UNLOCALISED.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return next();
  }

  return i18nMiddleware(context, next);
});
