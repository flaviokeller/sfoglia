import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PricingTable from './PricingTable.vue';

const tiers = [
  {
    name: 'Kontrolle',
    price: 'CHF 120',
    period: 'pro Termin',
    description: 'Für die jährliche Vorsorge.',
    features: ['Untersuchung', 'Zahnstein entfernen', 'Beratung'],
    cta: { label: 'Termin vereinbaren', href: '#kontakt' },
  },
  {
    name: 'Prophylaxe',
    price: 'CHF 210',
    period: 'pro Termin',
    description: 'Gründliche Reinigung mit Politur.',
    features: ['Alles aus Kontrolle', 'Airflow-Reinigung', 'Fluoridierung', 'Röntgen bei Bedarf'],
    highlighted: true,
    cta: { label: 'Termin vereinbaren', href: '#kontakt' },
  },
  {
    name: 'Bleaching',
    price: 'ab CHF 480',
    description: 'Aufhellung unter ärztlicher Aufsicht.',
    features: ['Vorabuntersuchung', 'Individuelle Schiene', 'Kontrolltermin'],
    cta: { label: 'Beratung anfragen', href: '#kontakt' },
  },
];

const groups = [
  {
    title: 'Vorsorge',
    items: [
      { name: 'Kontrolluntersuchung', price: 'CHF 85' },
      { name: 'Zahnreinigung', description: 'Inklusive Politur und Fluorid.', price: 'CHF 160' },
    ],
  },
  {
    title: 'Ästhetik',
    items: [
      { name: 'Bleaching', description: 'Beide Kiefer, mit Schiene.', price: 'ab CHF 480' },
      { name: 'Veneers', description: 'Pro Zahn, nach Beratung.', price: 'auf Anfrage' },
    ],
  },
];

const meta: Meta<typeof PricingTable> = {
  title: 'Sections/PricingTable',
  component: PricingTable,
  parameters: { layout: 'fullscreen' },
  argTypes: { variant: { control: 'inline-radio', options: ['tiers', 'list'] } },
  args: {
    variant: 'tiers',
    title: 'Preise',
    intro: 'Transparent und vorab besprochen.',
    tiers,
    groups,
    note: 'Alle Preise in CHF. Einen Kostenvoranschlag erhalten Sie vor jeder Behandlung.',
  },
};
export default meta;
type Story = StoryObj<typeof PricingTable>;

export const Tiers: Story = {};

export const OnSurface: Story = { args: { surface: true } };

export const List: Story = { args: { variant: 'list' } };

/** Two packages, none highlighted. */
export const TwoTiers: Story = {
  args: { tiers: tiers.slice(0, 2).map((tier) => ({ ...tier, highlighted: false })) },
};

/** No CTA, no features: a price card must still stand up as plain text. */
export const BareTiers: Story = {
  args: {
    tiers: tiers.map(({ features: _f, cta: _c, ...rest }) => ({ ...rest, highlighted: false })),
  },
};

export const ListWithoutGroupTitles: Story = {
  args: {
    variant: 'list',
    groups: [{ items: groups.flatMap((group) => group.items) }],
  },
};
