import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SiteHeader from './SiteHeader.vue';

const meta: Meta<typeof SiteHeader> = {
  title: 'Layout/SiteHeader',
  component: SiteHeader,
  parameters: { layout: 'fullscreen' },
  args: {
    businessName: 'Praxis am See',
    homeHref: '/de/',
    links: [
      { href: '/de/', label: 'Start' },
      { href: '/de/leistungen/', label: 'Leistungen' },
      { href: '/de/team/', label: 'Team' },
      { href: '/de/kontakt/', label: 'Kontakt' },
    ],
    current: '/de/leistungen/',
    languages: [
      { code: 'de', name: 'Deutsch', href: '/de/leistungen/', current: true },
      { code: 'en', name: 'English', href: '/en/leistungen/' },
    ],
    languageSwitchLabel: 'Sprache wechseln',
    menuLabel: 'Menü',
    closeLabel: 'Menü schliessen',
  },
};
export default meta;
type Story = StoryObj<typeof SiteHeader>;

export const Default: Story = {};

/** Brand and language switch only — a coming-soon page. */
export const Minimal: Story = { args: { minimal: true } };

/** A long name wraps and hyphenates instead of pushing the menu off a phone. */
export const LongName: Story = {
  args: { businessName: 'Zahnarztpraxis Dr. Meier & Partner am Zürichsee' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
