import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { placeholderImage } from '../stories/placeholder';
import HeroSection from './HeroSection.vue';

const meta: Meta<typeof HeroSection> = {
  title: 'Sections/HeroSection',
  component: HeroSection,
  parameters: { layout: 'fullscreen' },
  argTypes: { as: { control: 'inline-radio', options: ['h1', 'h2'] } },
  args: {
    eyebrow: 'Zahnarztpraxis in Zürich',
    title: 'Ruhige Zahnmedizin, die Zeit hat',
    lead: 'Persönliche Betreuung von der Vorsorge bis zum Implantat — ohne Wartezimmer-Stress.',
    image: placeholderImage(210, 'Behandlungsraum der Praxis'),
    primaryCta: { href: '#kontakt', label: 'Termin vereinbaren' },
    secondaryCta: { href: '#leistungen', label: 'Leistungen' },
    as: 'h1',
  },
};
export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {};

/** No photo yet: the text takes the full width instead of leaving a hole. */
export const WithoutImage: Story = { args: { image: undefined } };

export const TitleOnly: Story = {
  args: {
    eyebrow: undefined,
    lead: undefined,
    image: undefined,
    primaryCta: undefined,
    secondaryCta: undefined,
  },
};

export const PrimaryActionOnly: Story = { args: { secondaryCta: undefined } };

/** Used twice on a page: the second one drops to h2 so there is one h1. */
export const AsH2: Story = { args: { as: 'h2' } };

export const LongGermanTitle: Story = {
  args: {
    title: 'Zahnbehandlungsangst-Sprechstunde und Rundumbetreuung',
  },
};
