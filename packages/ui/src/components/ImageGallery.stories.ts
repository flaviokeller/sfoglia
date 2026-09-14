import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ImageGallery from './ImageGallery.vue';

/** Inline SVG placeholders keep the story self-contained — no network, no binary fixtures. */
const placeholder = (label: string, hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="hsl(${hue} 45% 72%)"/>
      <text x="400" y="315" font-family="sans-serif" font-size="56" fill="hsl(${hue} 60% 25%)"
        text-anchor="middle">${label}</text>
    </svg>`,
  )}`;

const images = [
  { src: placeholder('Empfang', 250), alt: 'Empfangsbereich der Praxis', caption: 'Unser Empfang' },
  { src: placeholder('Behandlung', 160), alt: 'Behandlungszimmer', caption: 'Behandlungszimmer 1' },
  { src: placeholder('Team', 30), alt: 'Das Team der Praxis', caption: 'Das ganze Team' },
  { src: placeholder('Warten', 300), alt: 'Wartezimmer mit Seeblick' },
];

const meta: Meta<typeof ImageGallery> = {
  title: 'Components/Gallery',
  component: ImageGallery,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Click a tile to open the lightbox. Built on the native `<dialog>`, so Escape-to-close, the backdrop and focus containment come from the platform. Arrow keys step between images.',
      },
    },
  },
  args: { images },
  render: (args) => ({
    components: { ImageGallery },
    setup: () => ({ args }),
    template: '<ImageGallery v-bind="args" />',
  }),
};
export default meta;
type Story = StoryObj<typeof ImageGallery>;

export const Default: Story = {};
export const SingleImage: Story = { args: { images: images.slice(0, 1) } };
