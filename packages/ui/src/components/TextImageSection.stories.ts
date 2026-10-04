import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { placeholderImage } from '../stories/placeholder';
import TextImageSection from './TextImageSection.vue';

const meta: Meta<typeof TextImageSection> = {
  title: 'Sections/TextImageSection',
  component: TextImageSection,
  parameters: { layout: 'fullscreen' },
  args: {
    eyebrow: 'Über uns',
    title: 'Eine Praxis mit Zeit für Sie',
    image: placeholderImage(30, 'Das Praxisteam im Empfangsbereich', 1000, 750),
    reversed: false,
    surface: false,
  },
  render: (args) => ({
    components: { TextImageSection },
    setup: () => ({ args }),
    template: `<TextImageSection v-bind="args">
      <p>Seit 2009 begleiten wir Familien in Zürich und Umgebung. Wir erklären, was wir tun, bevor wir es tun.</p>
      <p>Unsere Behandlungsräume sind hell, ruhig und auf dem neuesten Stand der Technik.</p>
    </TextImageSection>`,
  }),
};
export default meta;
type Story = StoryObj<typeof TextImageSection>;

export const Default: Story = {};

export const Reversed: Story = { args: { reversed: true } };

export const OnSurface: Story = { args: { surface: true } };

export const WithoutImage: Story = { args: { image: undefined } };
