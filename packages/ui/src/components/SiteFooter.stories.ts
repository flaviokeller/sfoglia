import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SiteFooter from './SiteFooter.vue';

const meta: Meta<typeof SiteFooter> = {
  title: 'Layout/SiteFooter',
  component: SiteFooter,
  parameters: { layout: 'fullscreen' },
  args: {
    businessName: 'Praxis am See',
    legalName: 'Praxis am See AG',
    street: 'Seestrasse 12',
    locality: '8002 Zürich',
    phone: '044 123 45 67',
    phoneHref: 'tel:+41441234567',
    email: 'info@praxis-am-see.ch',
    socials: [
      { icon: 'instagram', label: 'Instagram', href: 'https://instagram.com/example' },
      { icon: 'youtube', label: 'YouTube', href: 'https://youtube.com/@example' },
      { icon: 'link', label: 'Website', href: 'https://example.ch' },
    ],
    socialLabel: 'Soziale Medien',
    legalLinks: [
      { href: '/de/impressum/', label: 'Impressum' },
      { href: '/de/datenschutz/', label: 'Datenschutz' },
    ],
    legalLabel: 'Rechtliches',
    rights: 'Alle Rechte vorbehalten.',
    year: 2026,
  },
};
export default meta;
type Story = StoryObj<typeof SiteFooter>;

export const Default: Story = {};

/** Every contact field is optional: blank ones drop out, nothing dangles. */
export const Minimal: Story = {
  args: {
    legalName: undefined,
    street: undefined,
    locality: undefined,
    phone: undefined,
    email: undefined,
    socials: [],
  },
};

/** A half-filled social entry in the editor must not render as a dead icon. */
export const HalfFilledSocial: Story = {
  args: { socials: [{ icon: 'instagram', label: 'Instagram', href: '' }] },
};
