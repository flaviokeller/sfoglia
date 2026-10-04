import type { Meta, StoryObj } from '@storybook/vue3-vite';
import OpeningHoursSection from './OpeningHoursSection.vue';

const dayNames = {
  monday: 'Montag',
  tuesday: 'Dienstag',
  wednesday: 'Mittwoch',
  thursday: 'Donnerstag',
  friday: 'Freitag',
  saturday: 'Samstag',
  sunday: 'Sonntag',
} as const;

const hours = [
  { day: 'monday', opens: '08:00', closes: '17:30' },
  { day: 'tuesday', opens: '08:00', closes: '17:30' },
  { day: 'wednesday', opens: '08:00', closes: '12:00' },
  { day: 'thursday', opens: '08:00', closes: '17:30' },
  { day: 'friday', opens: '08:00', closes: '16:00' },
  { day: 'saturday', opens: '', closes: '' },
  { day: 'sunday', opens: '', closes: '' },
] as const;

const meta: Meta<typeof OpeningHoursSection> = {
  title: 'Sections/OpeningHoursSection',
  component: OpeningHoursSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "`today` pins the highlighted row for stories. The site sets `live`, so the row is derived from the visitor's clock on hydration instead of freezing at build time.",
      },
    },
  },
  args: {
    title: 'Öffnungszeiten',
    street: 'Seestrasse 12',
    locality: '8002 Zürich',
    phone: '044 123 45 67',
    phoneHref: 'tel:+41441234567',
    mapLink: { href: 'https://maps.example.com', label: 'Zürich · Auf der Karte' },
    hours: [...hours],
    dayNames,
    closedLabel: 'Geschlossen',
    today: 'wednesday',
    surface: true,
  },
};
export default meta;
type Story = StoryObj<typeof OpeningHoursSection>;

export const Default: Story = {};

/** No hours entered yet: the address block stands alone. */
export const NoHours: Story = { args: { hours: [] } };

/** Every contact field is optional: blanks drop out, no stray lines. */
export const AddressOnly: Story = {
  args: { phone: undefined, phoneHref: undefined, mapLink: undefined, hours: [] },
};

export const NoToday: Story = { args: { today: undefined } };

export const English: Story = {
  args: {
    title: 'Opening hours',
    closedLabel: 'Closed',
    dayNames: {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
    },
  },
};
