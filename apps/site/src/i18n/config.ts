/**
 * SETUP: to drop a locale, remove it from LOCALES and delete
 * `src/i18n/<locale>.json` plus the matching `<locale>` folders under `src/content/`. To add one, do the
 * reverse — nothing else in the codebase enumerates locales.
 */
export const LOCALES = ['de', 'en'] as const;
export const DEFAULT_LOCALE = 'de';

export type Locale = (typeof LOCALES)[number];

/** Shown in the language switcher. */
export const LOCALE_NAMES: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
};

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (LOCALES as readonly string[]).includes(value);
}

/**
 * Pulls the locale out of a pathname like `/de/leistungen/`.
 * Falls back to the default rather than throwing — a missing locale should
 * degrade to the default language, never to a 500.
 */
export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0];
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

/** Swaps the locale segment of a path, preserving the rest. Used by the switcher. */
export function withLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (isLocale(segments[0])) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }
  return `/${segments.join('/')}/`.replace(/\/+$/, '/');
}
