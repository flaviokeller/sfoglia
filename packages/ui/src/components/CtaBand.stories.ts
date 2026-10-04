import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CtaBand from './CtaBand.vue';

const meta: Meta<typeof CtaBand> = {
  title: 'Sections/CtaBand',
  component: CtaBand,
  parameters: { layout: 'fullscreen' },
  argTypes: { tone: { control: 'inline-radio', options: ['accent', 'surface'] } },
  args: {
    title: 'Bereit für Ihren ersten Termin?',
    text: 'Wir melden uns innert eines Werktags bei Ihnen.',
    primary: { label: 'Termin vereinbaren', href: '#kontakt' },
    tone: 'accent',
  },
};
export default meta;
type Story = StoryObj<typeof CtaBand>;

export const Default: Story = {};

export const Surface: Story = { args: { tone: 'surface' } };

export const WithSecondaryAction: Story = {
  args: { secondary: { label: '044 123 45 67', href: 'tel:+41441234567' } },
};

/** Editor left the text empty: the headline carries the band alone. */
export const TitleOnly: Story = { args: { text: '' } };

export const LongCopy: Story = {
  args: {
    title: 'Wir nehmen uns Zeit für eine ausführliche Beratung zu Ihrer Behandlung',
    text: 'Von der ersten Untersuchung über den Kostenvoranschlag bis zur Nachsorge begleiten wir Sie persönlich, in Ruhe und ohne Zeitdruck.',
    secondary: { label: 'Mehr erfahren', href: '#leistungen' },
  },
};
