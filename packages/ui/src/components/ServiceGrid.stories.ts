import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ServiceGrid from './ServiceGrid.vue';

const services = [
  {
    title: 'Prophylaxe',
    summary: 'Professionelle Zahnreinigung und individuelle Beratung.',
    href: '#prophylaxe',
  },
  {
    title: 'Implantologie',
    summary: 'Festsitzender Zahnersatz, schonend und langlebig.',
    href: '#implantologie',
  },
  { title: 'Ästhetik', summary: 'Bleaching und Veneers für ein natürliches Lächeln.' },
];

const meta: Meta<typeof ServiceGrid> = {
  title: 'Sections/ServiceGrid',
  component: ServiceGrid,
  parameters: { layout: 'fullscreen' },
  argTypes: { as: { control: 'inline-radio', options: ['h1', 'h2'] } },
  args: {
    eyebrow: 'Leistungen',
    title: 'Was wir für Sie tun',
    lead: 'Von der Kontrolle bis zur Behandlung — alles unter einem Dach.',
    services,
    as: 'h2',
    surface: true,
  },
};
export default meta;
type Story = StoryObj<typeof ServiceGrid>;

export const Default: Story = {};

/** Cards with a link stretch their hit area over the whole card. */
export const NoLinks: Story = { args: { services: services.map(({ href: _h, ...rest }) => rest) } };

/** The grid is the page itself (Leistungen). */
export const AsPage: Story = { args: { as: 'h1' } };

/** As a section, an empty grid drops out entirely. */
export const EmptySection: Story = { args: { services: [] } };

/** As the page, it keeps its heading so the page is never blank. */
export const EmptyPage: Story = { args: { services: [], as: 'h1' } };
