import type { APIRoute } from 'astro';

import { DEFAULT_LOCALE } from '../i18n/config';

/**
 * Root entry. Because `prefixDefaultLocale: true`, `/` is not a real page.
 * It runs on demand and redirects to the visitor's preferred locale
 * (Accept-Language matched against LOCALES), falling back to the default.
 * This replaces the per-locale redirect rules the Netlify config used to list.
 */
export const prerender = false;

export const GET: APIRoute = ({ preferredLocale, redirect }) =>
  redirect(`/${preferredLocale ?? DEFAULT_LOCALE}/`, 302);
