import { site } from '../data/site';
import { DEFAULT_LOCALE, type Locale } from './config.js';
import de from './de.json';
import en from './en.json';

const DICTIONARIES = { de, en } satisfies Record<Locale, Record<string, string>>;

/** Every key that exists in the default dictionary. Typos become type errors. */
export type TranslationKey = keyof typeof de;

/**
 * Returns a translator bound to one locale.
 *
 * Missing keys fall back to the default locale, then to the key itself, and warn
 * in dev — a half-translated site should still render, but never silently.
 */
export function getTranslations(locale: Locale) {
  return function t(key: TranslationKey): string {
    const dictionary = DICTIONARIES[locale] as Record<string, string>;
    const fallback = DICTIONARIES[DEFAULT_LOCALE] as Record<string, string>;
    const value = dictionary[key] ?? fallback[key];

    if (value === undefined) {
      if (import.meta.env.DEV) {
        console.warn(`[i18n] missing translation for "${key}" in "${locale}"`);
      }
      return key;
    }
    return value;
  };
}

/** Convenience for passing a whole label group to a Lit component. */
export function contactFormLabels(locale: Locale) {
  const t = getTranslations(locale);
  return {
    name: t('contact.form.name'),
    email: t('contact.form.email'),
    message: t('contact.form.message'),
    submit: t('contact.form.submit'),
    sending: t('contact.form.sending'),
    success: t('contact.form.success'),
    // The fallback address makes a failed send recoverable rather than a dead end.
    error: t('contact.form.error').replace('{email}', site.email),
    required: t('contact.form.required'),
    invalidEmail: t('contact.form.invalidEmail'),
  };
}
