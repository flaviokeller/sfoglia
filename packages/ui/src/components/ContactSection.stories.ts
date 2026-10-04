import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ContactSection from './ContactSection.vue';

const meta: Meta<typeof ContactSection> = {
  title: 'Sections/ContactSection',
  component: ContactSection,
  parameters: { layout: 'fullscreen' },
  argTypes: { as: { control: 'inline-radio', options: ['h1', 'h2'] } },
  args: { title: 'Kontakt', as: 'h2', formName: 'contact', successUrl: '/de/danke/' },
};
export default meta;
type Story = StoryObj<typeof ContactSection>;

export const Default: Story = {};

/** The section is the page itself (Kontakt). */
export const AsPage: Story = { args: { as: 'h1' } };

export const English: Story = {
  args: {
    title: 'Contact',
    labels: { name: 'Name', email: 'Email', message: 'Message', submit: 'Send' },
  },
};
