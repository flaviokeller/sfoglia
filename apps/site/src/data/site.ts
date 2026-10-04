import raw from './site.json';

export type OpeningHour = {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  /** Empty string means closed that day. */
  opens: string;
  closes: string;
};

export type SocialIcon = 'instagram' | 'youtube' | 'link';

export type SiteSettings = {
  /**
   * schema.org type for the structured data: `LocalBusiness` or a subtype
   * (`Dentist`, `Restaurant` …, see schema.org/LocalBusiness) for anything with
   * premises, `Person` for an individual (performer, freelancer) — a
   * LocalBusiness without premises or opening hours is worse than no markup.
   */
  schemaType: string;
  businessName: string;
  legalName: string;
  tagline: string;
  /** Person only: the role, emitted as schema.org `jobTitle`. */
  jobTitle: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  /** Swiss UID (CHE-…). Empty hides the Impressum block — never invent one. */
  uid: string;
  /** Optional: a client without premises (schemaType Person) omits both. */
  mapUrl?: string;
  openingHours?: OpeningHour[];
  /** Footer profile links. Their hrefs double as schema.org `sameAs`. */
  socials: { icon: SocialIcon; label: string; href: string }[];
  analytics: { cloudflareToken: string };
};

export const site = raw as SiteSettings;

/** Day names per locale, so the hours table does not need entries in the i18n dictionary. */
export const DAY_NAMES = {
  de: {
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag',
  },
  en: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  },
} as const;

/** Maps to schema.org's two-letter day codes for the LocalBusiness structured data. */
const SCHEMA_DAYS: Record<OpeningHour['day'], string> = {
  monday: 'Mo',
  tuesday: 'Tu',
  wednesday: 'We',
  thursday: 'Th',
  friday: 'Fr',
  saturday: 'Sa',
  sunday: 'Su',
};

export function openingHoursSpecification() {
  return (site.openingHours ?? [])
    .filter((entry) => entry.opens && entry.closes)
    .map((entry) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: SCHEMA_DAYS[entry.day],
      opens: entry.opens,
      closes: entry.closes,
    }));
}

/** schema.org JSON-LD for the whole site, shaped by `site.schemaType`. */
export function structuredData(description: string, url?: string) {
  // Absolute URLs only: a placeholder like "#" is not a profile.
  const sameAs = site.socials
    .map((social) => social.href)
    .filter((href) => /^https?:\/\//.test(href));
  const common = {
    '@context': 'https://schema.org',
    '@type': site.schemaType,
    name: site.businessName,
    description,
    url,
    email: site.email || undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };

  // An individual: no premises to publish, so only the locality.
  if (site.schemaType === 'Person') {
    return {
      ...common,
      jobTitle: site.jobTitle || undefined,
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.city,
        addressCountry: site.country,
      },
    };
  }

  return {
    ...common,
    legalName: site.legalName || undefined,
    telephone: site.phone || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      postalCode: site.postalCode,
      addressLocality: site.city,
      addressCountry: site.country,
    },
    openingHoursSpecification: openingHoursSpecification(),
  };
}

/**
 * `tel:` href from a phone number as an editor types it. Strips spaces,
 * punctuation and the Swiss/German "(0)" trunk prefix, which is invalid after
 * a country code: "+41 (0)44 123 45 67" -> "tel:+41441234567".
 */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\(0\)/g, '').replace(/[^\d+]/g, '')}`;
}
