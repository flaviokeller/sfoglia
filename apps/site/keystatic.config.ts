import { collection, config, fields, singleton } from '@keystatic/core';

import { LOCALES } from './src/i18n/config';

/**
 * Keystatic — the client-facing editor.
 *
 * The locale is never a field: it is the folder each collection writes into
 * (`src/content/pages/de/*`), so it cannot drift from the file's real location.
 *
 * The schema here MUST mirror `src/content.config.ts`. Keystatic writes the
 * files; Astro's Zod schemas validate them at build time. If they drift, the
 * build fails rather than the site rendering wrong — which is the behaviour we
 * want, but it means schema changes have to be made in both places.
 *
 * Storage:
 *  - local  — writes straight to the filesystem, no auth. Used in `npm run dev`.
 *  - github — the client signs in with GitHub and Keystatic commits via a GitHub
 *             App. SETUP.md covers creating that app (a one-time, per-repo step).
 */

const isProd = import.meta.env.PROD;

/** Per-locale collections. Content diverges between languages, so each gets its own tree. */
function localisedCollections() {
  return Object.fromEntries(
    LOCALES.flatMap((locale) => [
      [
        `pages_${locale}`,
        collection({
          label: `Seiten (${locale.toUpperCase()})`,
          slugField: 'title',
          path: `src/content/pages/${locale}/*`,
          format: { contentField: 'body' },
          schema: {
            title: fields.slug({ name: { label: 'Titel' } }),
            eyebrow: fields.text({ label: 'Eyebrow (kleine Zeile über dem Titel)' }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            heroImage: fields.image({
              label: 'Hero-Bild',
              // All uploads land in one place so they are easy to audit and purge.
              directory: 'src/assets/images',
              publicPath: '/src/assets/images/',
              description: 'Bitte vor dem Hochladen auf max. 500 KB verkleinern.',
            }),
            heroImageAlt: fields.text({
              label: 'Bildbeschreibung (Alt-Text)',
              description: 'Was ist auf dem Bild zu sehen? Wichtig für Barrierefreiheit und SEO.',
            }),
            seo: fields.object(
              {
                title: fields.text({
                  label: 'SEO-Titel',
                  description: 'Max. 60 Zeichen, sonst kürzt Google.',
                  validation: { length: { max: 60 } },
                }),
                description: fields.text({
                  label: 'SEO-Beschreibung',
                  multiline: true,
                  description: 'Max. 160 Zeichen.',
                  validation: { length: { max: 160 } },
                }),
                ogImage: fields.text({ label: 'Social-Media-Bild (URL)' }),
                noindex: fields.checkbox({
                  label: 'Von Suchmaschinen ausschliessen',
                  defaultValue: false,
                }),
              },
              { label: 'SEO' },
            ),
            body: fields.markdoc({ label: 'Inhalt' }),
          },
        }),
      ],
      [
        `services_${locale}`,
        collection({
          label: `Leistungen (${locale.toUpperCase()})`,
          slugField: 'title',
          path: `src/content/services/${locale}/*`,
          format: { data: 'yaml' },
          schema: {
            title: fields.slug({ name: { label: 'Titel' } }),
            summary: fields.text({ label: 'Kurzbeschreibung', multiline: true }),
            order: fields.integer({ label: 'Reihenfolge', defaultValue: 0 }),
          },
        }),
      ],
      [
        `team_${locale}`,
        collection({
          label: `Team (${locale.toUpperCase()})`,
          slugField: 'name',
          path: `src/content/team/${locale}/*`,
          format: { data: 'yaml' },
          schema: {
            name: fields.slug({ name: { label: 'Name' } }),
            role: fields.text({ label: 'Funktion' }),
            bio: fields.text({ label: 'Kurzvorstellung', multiline: true }),
            photo: fields.image({
              label: 'Foto',
              directory: 'src/assets/images',
              publicPath: '/src/assets/images/',
              description: 'Bitte vor dem Hochladen auf max. 500 KB verkleinern.',
            }),
            photoAlt: fields.text({ label: 'Bildbeschreibung (Alt-Text)' }),
            order: fields.integer({ label: 'Reihenfolge', defaultValue: 0 }),
          },
        }),
      ],
      [
        `pricing_${locale}`,
        collection({
          label: `Preise (${locale.toUpperCase()})`,
          slugField: 'title',
          path: `src/content/pricing/${locale}/*`,
          format: { data: 'yaml' },
          schema: {
            title: fields.slug({ name: { label: 'Bezeichnung' } }),
            // Text, not a number: "ab CHF 80" and "auf Anfrage" are valid prices.
            price: fields.text({ label: 'Preis (z. B. CHF 120, ab CHF 80)' }),
            period: fields.text({ label: 'Pro … (z. B. pro Termin)' }),
            description: fields.text({ label: 'Beschreibung', multiline: true }),
            features: fields.array(fields.text({ label: 'Punkt' }), {
              label: 'Enthaltene Leistungen (nur Paket-Ansicht)',
              itemLabel: (props) => props.value,
            }),
            highlighted: fields.checkbox({
              label: 'Hervorheben (nur Paket-Ansicht)',
              defaultValue: false,
            }),
            group: fields.text({
              label: 'Gruppe (nur Listen-Ansicht, z. B. Vorsorge)',
            }),
            order: fields.integer({ label: 'Reihenfolge', defaultValue: 0 }),
          },
        }),
      ],
      [
        `stats_${locale}`,
        collection({
          label: `Kennzahlen (${locale.toUpperCase()})`,
          slugField: 'label',
          path: `src/content/stats/${locale}/*`,
          format: { data: 'yaml' },
          schema: {
            label: fields.slug({ name: { label: 'Bezeichnung (z. B. Gegründet)' } }),
            value: fields.text({ label: 'Wert (z. B. 1998, 4 200+)' }),
            order: fields.integer({ label: 'Reihenfolge', defaultValue: 0 }),
          },
        }),
      ],
      [
        `events_${locale}`,
        collection({
          label: `Termine (${locale.toUpperCase()})`,
          slugField: 'title',
          path: `src/content/events/${locale}/*`,
          format: { data: 'yaml' },
          schema: {
            title: fields.slug({ name: { label: 'Titel' } }),
            // Text, not fields.date: the date must stay a string (see content.config.ts).
            date: fields.text({
              label: 'Datum (JJJJ-MM-TT)',
              description: 'Genau in diesem Format, z. B. 2026-10-09.',
              validation: {
                isRequired: true,
                pattern: {
                  regex: /^\d{4}-\d{2}-\d{2}$/,
                  message: 'Format JJJJ-MM-TT, z. B. 2026-10-09',
                },
              },
            }),
            time: fields.text({ label: 'Uhrzeit (z. B. 19:00)' }),
            venue: fields.text({ label: 'Ort / Lokal' }),
            town: fields.text({ label: 'Stadt' }),
            url: fields.text({ label: 'Link (Anmeldung oder Details)' }),
          },
        }),
      ],
      [
        `faq_${locale}`,
        collection({
          label: `FAQ (${locale.toUpperCase()})`,
          slugField: 'question',
          path: `src/content/faq/${locale}/*`,
          format: { data: 'yaml' },
          schema: {
            question: fields.slug({ name: { label: 'Frage' } }),
            answer: fields.text({ label: 'Antwort', multiline: true }),
            order: fields.integer({ label: 'Reihenfolge', defaultValue: 0 }),
          },
        }),
      ],
      [
        `testimonials_${locale}`,
        collection({
          label: `Stimmen (${locale.toUpperCase()})`,
          slugField: 'author',
          path: `src/content/testimonials/${locale}/*`,
          format: { data: 'yaml' },
          schema: {
            author: fields.slug({ name: { label: 'Name' } }),
            quote: fields.text({ label: 'Zitat', multiline: true }),
            context: fields.text({ label: 'Kontext (z. B. "Patientin seit 2019")' }),
            order: fields.integer({ label: 'Reihenfolge', defaultValue: 0 }),
          },
        }),
      ],
    ]),
  );
}

export default config({
  storage: isProd
    ? {
        kind: 'github',
        // SETUP: point this at the client's repo.
        repo: { owner: 'flaviocodes', name: 'sfoglia' },
        // This repo is an npm workspaces monorepo — the collection `path`s above
        // (e.g. `src/content/faq/de/*`) are relative to this file in local mode,
        // but GitHub mode resolves them against the repo ROOT. Without this
        // prefix every collection reads as empty in production and new entries
        // land in a stray top-level `src/`.
        pathPrefix: 'apps/site/',
      }
    : { kind: 'local' },

  ui: {
    brand: { name: 'Praxis am See' },
  },

  singletons: {
    settings: singleton({
      label: 'Grunddaten & Öffnungszeiten',
      path: 'src/data/site',
      format: { data: 'json' },
      schema: {
        schemaType: fields.text({
          label: 'Typ für Suchmaschinen',
          description:
            'schema.org-Typ: LocalBusiness oder eine Unterart (Dentist, Restaurant …) — oder Person für Einzelpersonen.',
          defaultValue: 'LocalBusiness',
        }),
        businessName: fields.text({ label: 'Name' }),
        legalName: fields.text({ label: 'Firma (rechtlich)' }),
        tagline: fields.text({ label: 'Slogan' }),
        jobTitle: fields.text({ label: 'Beruf (nur bei Typ Person)' }),
        email: fields.text({ label: 'E-Mail' }),
        phone: fields.text({ label: 'Telefon' }),
        street: fields.text({ label: 'Strasse' }),
        postalCode: fields.text({ label: 'PLZ' }),
        city: fields.text({ label: 'Ort' }),
        country: fields.text({ label: 'Land (2 Buchstaben)', defaultValue: 'CH' }),
        uid: fields.text({
          label: 'UID (CHE-…)',
          description:
            'Nur falls im Handelsregister eingetragen. Leer = wird im Impressum nicht angezeigt.',
        }),
        mapUrl: fields.url({ label: 'Link zur Karte' }),
        openingHours: fields.array(
          fields.object({
            day: fields.select({
              label: 'Tag',
              options: [
                { label: 'Montag', value: 'monday' },
                { label: 'Dienstag', value: 'tuesday' },
                { label: 'Mittwoch', value: 'wednesday' },
                { label: 'Donnerstag', value: 'thursday' },
                { label: 'Freitag', value: 'friday' },
                { label: 'Samstag', value: 'saturday' },
                { label: 'Sonntag', value: 'sunday' },
              ],
              defaultValue: 'monday',
            }),
            opens: fields.text({ label: 'Von (z. B. 08:00) — leer lassen = geschlossen' }),
            closes: fields.text({ label: 'Bis (z. B. 17:00)' }),
          }),
          { label: 'Öffnungszeiten', itemLabel: (props) => props.fields.day.value },
        ),
        socials: fields.array(
          fields.object({
            icon: fields.select({
              label: 'Symbol',
              options: [
                { label: 'Instagram', value: 'instagram' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Anderer Link', value: 'link' },
              ],
              defaultValue: 'instagram',
            }),
            label: fields.text({ label: 'Bezeichnung (für Screenreader)' }),
            href: fields.url({ label: 'Profil-URL' }),
          }),
          { label: 'Social-Media-Profile', itemLabel: (props) => props.fields.label.value },
        ),
        analytics: fields.object(
          {
            cloudflareToken: fields.text({
              label: 'Cloudflare Web Analytics Token',
              description: 'Leer lassen = keine Statistik, kein Cookie-Banner nötig.',
            }),
          },
          { label: 'Statistik' },
        ),
      },
    }),
  },

  collections: localisedCollections(),
});
