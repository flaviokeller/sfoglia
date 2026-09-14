import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SiteNav from './SiteNav.vue';

const links = [
  { href: '/de/', label: 'Start' },
  { href: '/de/leistungen/', label: 'Leistungen' },
  { href: '/de/team/', label: 'Team' },
  { href: '/de/kontakt/', label: 'Kontakt' },
];

const meta: Meta<typeof SiteNav> = {
  title: 'Components/Nav',
  component: SiteNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Below 48rem the link bar is replaced by a drawer. Narrow the preview pane, or use the viewport toolbar, to see it.',
      },
    },
  },
  args: { links, current: '/de/leistungen/' },
  render: (args) => ({
    components: { SiteNav },
    setup: () => ({ args }),
    template: `
      <header
        style="display:flex;align-items:center;justify-content:space-between;
               padding:var(--space-md) var(--gutter);
               border-block-end:1px solid var(--color-border)"
      >
        <strong class="heading-4">Praxis am See</strong>
        <SiteNav v-bind="args" />
      </header>
    `,
  }),
};
export default meta;
type Story = StoryObj<typeof SiteNav>;

export const Default: Story = {};
