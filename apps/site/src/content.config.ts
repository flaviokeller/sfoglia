import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content collections. These MUST stay in sync with `keystatic.config.ts` —
 * Keystatic writes the files, Astro reads and validates them. If a client saves
 * something the Zod schema rejects, the build fails loudly rather than shipping
 * a broken page.
 *
 * Entry ids are locale-prefixed (`de/home`, `en/home`) because content lives in
 * per-locale folders — translations are allowed to diverge, not just be
 * word-for-word copies.
 *
 * File formats are dictated by Keystatic, not chosen freely:
 *   pages          .mdoc  — has a rich-text body (Markdoc, not MDX: a client
 *                           cannot break the build with a stray `{`)
 *   everything else .yaml — structured data only, no prose body
 *
 * The locale is NOT a field. It is the folder name, so it cannot drift from
 * where the file actually lives and the client can never set it wrong. Read it
 * with `localeOf(entry)` below.
 */

const seo = z.object({
  title: z.string().max(60, 'Keep under ~60 chars or Google truncates it'),
  description: z.string().max(160, 'Keep under ~160 chars or Google truncates it'),
  ogImage: z.string().optional(),
  noindex: z.boolean().default(false),
});

const pages = defineCollection({
  loader: glob({ base: 'src/content/pages', pattern: '**/*.mdoc' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      eyebrow: z.string().optional(),
      lead: z.string().optional(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      seo,
    }),
});

const services = defineCollection({
  loader: glob({ base: 'src/content/services', pattern: '**/*.yaml' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      icon: image().optional(),
      order: z.number().default(0),
    }),
});

const team = defineCollection({
  loader: glob({ base: 'src/content/team', pattern: '**/*.yaml' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      photo: image().optional(),
      photoAlt: z.string().optional(),
      order: z.number().default(0),
    }),
});

const faq = defineCollection({
  loader: glob({ base: 'src/content/faq', pattern: '**/*.yaml' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().default(0),
  }),
});

const testimonials = defineCollection({
  loader: glob({ base: 'src/content/testimonials', pattern: '**/*.yaml' }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    context: z.string().optional(),
    order: z.number().default(0),
  }),
});

/**
 * Termine. `date` is a YYYY-MM-DD string, not a YAML date: YAML would parse an
 * unquoted date as UTC midnight and the rendered day could shift. The
 * upcoming/past split happens in the browser (EventList `live`), so the list
 * stays correct between deploys.
 *
 * Optional text fields accept '' because Keystatic saves untouched fields as
 * empty strings — `z.string().url()` alone would fail the build on the first
 * event entered without a link.
 */
const events = defineCollection({
  loader: glob({ base: 'src/content/events', pattern: '**/*.yaml' }),
  schema: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
    time: z.string().optional(),
    title: z.string(),
    venue: z.string().optional(),
    town: z.string().optional(),
    url: z.union([z.string().url(), z.literal('')]).optional(),
  }),
});

/** The locale of an entry, derived from its id (`de/home` -> `de`). */
export function localeOf(entry: { id: string }): string {
  return entry.id.split('/')[0] ?? '';
}

/** Filter predicate for `getCollection`. */
export function inLocale(locale: string) {
  return (entry: { id: string }) => entry.id.startsWith(`${locale}/`);
}

export const collections = { pages, services, team, events, faq, testimonials };
