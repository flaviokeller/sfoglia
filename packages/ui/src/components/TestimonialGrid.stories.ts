import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TestimonialGrid from './TestimonialGrid.vue';

const meta: Meta<typeof TestimonialGrid> = {
  title: 'Sections/TestimonialGrid',
  component: TestimonialGrid,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Was Patientinnen und Patienten sagen',
    testimonials: [
      {
        quote: 'Endlich eine Praxis, in der ich keine Angst mehr habe.',
        author: 'M. Keller',
        context: 'Patientin seit 2018',
      },
      { quote: 'Klare Erklärungen, faire Preise, kurze Wartezeiten.', author: 'T. Weber' },
      {
        quote:
          'Die Implantat-Behandlung war von der Beratung bis zur Nachkontrolle bestens organisiert.',
        author: 'R. Frei',
        context: 'Implantologie',
      },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof TestimonialGrid>;

export const Default: Story = {};

export const WithoutTitle: Story = { args: { title: undefined } };

/** Editors type their own quote marks; the design adds curly ones, so they are stripped. */
export const EditorTypedQuotes: Story = {
  args: {
    testimonials: [
      { quote: '"Super Praxis"', author: 'A. B.' },
      { quote: '„Sehr freundlich“', author: 'C. D.' },
    ],
  },
};

/** Nothing to quote: renders nothing rather than an empty band. */
export const Empty: Story = { args: { testimonials: [] } };
