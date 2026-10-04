import type { Meta, StoryObj } from '@storybook/vue3-vite';
import StatsStrip from './StatsStrip.vue';

const meta: Meta<typeof StatsStrip> = {
  title: 'Sections/StatsStrip',
  component: StatsStrip,
  parameters: { layout: 'fullscreen' },
  args: {
    stats: [
      { value: '1998', label: 'Gegründet' },
      { value: '4 200+', label: 'Behandelte Patienten' },
      { value: '3', label: 'Fachärztinnen und Fachärzte' },
      { value: '4.9 / 5', label: 'Google-Bewertung' },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof StatsStrip>;

export const Default: Story = {};

export const WithTitle: Story = { args: { title: 'Die Praxis in Zahlen' } };

export const OnSurface: Story = { args: { surface: true } };

export const ThreeStats: Story = {
  args: {
    stats: [
      { value: '25', label: 'Jahre Erfahrung' },
      { value: '4 200+', label: 'Patienten' },
      { value: '4.9 / 5', label: 'Bewertung' },
    ],
  },
};

/** Free text, not numbers: values render exactly as typed. */
export const LongValues: Story = {
  args: {
    stats: [
      { value: 'Mo–Sa', label: 'Geöffnet' },
      { value: 'Am selben Tag', label: 'Notfalltermine' },
    ],
  },
};

/** Nothing to show: renders nothing rather than an empty band. */
export const Empty: Story = { args: { stats: [] } };
