import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FaqAccordion from './FaqAccordion.vue';

const items = [
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
];

const meta: Meta<typeof FaqAccordion> = {
  title: 'Components/Accordion',
  component: FaqAccordion,
  parameters: { layout: 'padded' },
  argTypes: {
    allowMultiple: { control: 'boolean' },
    initialOpen: { control: { type: 'number', min: -1, max: 2 } },
  },
  args: { items, allowMultiple: false, initialOpen: -1 },
  render: (args) => ({
    components: { FaqAccordion },
    setup: () => ({ args }),
    template: '<div style="max-inline-size:42rem"><FaqAccordion v-bind="args" /></div>',
  }),
};
export default meta;
type Story = StoryObj<typeof FaqAccordion>;

export const Default: Story = {};
export const FirstOpen: Story = { args: { initialOpen: 0 } };
export const MultipleOpen: Story = { args: { allowMultiple: true, initialOpen: 0 } };
