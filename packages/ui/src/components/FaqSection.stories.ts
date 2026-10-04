import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FaqSection from './FaqSection.vue';

const meta: Meta<typeof FaqSection> = {
  title: 'Sections/FaqSection',
  component: FaqSection,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Häufige Fragen',
    items: [
      {
        question: 'Muss ich für einen ersten Termin etwas mitbringen?',
        answer: 'Ihre Versichertenkarte und, falls vorhanden, frühere Röntgenbilder.',
      },
      {
        question: 'Übernimmt die Krankenkasse die Kosten?',
        answer:
          'Zahnbehandlungen sind in der Schweiz grundsätzlich Privatleistung. Wir erstellen vorab einen Kostenvoranschlag.',
      },
      {
        question: 'Wie kurzfristig bekomme ich einen Notfalltermin?',
        answer: 'In der Regel noch am selben Tag. Rufen Sie uns bitte direkt an.',
      },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof FaqSection>;

export const Default: Story = {};

/** No questions yet: renders nothing rather than a heading over an empty list. */
export const Empty: Story = { args: { items: [] } };
