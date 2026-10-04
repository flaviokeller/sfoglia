import raw from './site.json';

export type OpeningHour = {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  /** Empty string means closed that day. */
  opens: string;
  closes: string;
};

export type SiteSettings = {
  businessName: string;
  legalName: string;
  tagline: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  mapUrl: string;
  openingHours: OpeningHour[];
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
  return site.openingHours
    .filter((entry) => entry.opens && entry.closes)
    .map((entry) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: SCHEMA_DAYS[entry.day],
      opens: entry.opens,
      closes: entry.closes,
    }));
}

/**
 * `tel:` href from a phone number as an editor types it. Strips spaces,
 * punctuation and the Swiss/German "(0)" trunk prefix, which is invalid after
 * a country code: "+41 (0)44 123 45 67" -> "tel:+41441234567".
 */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\(0\)/g, '').replace(/[^\d+]/g, '')}`;
}
