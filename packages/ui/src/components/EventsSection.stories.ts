import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EventsSection from './EventsSection.vue';

const today = '2026-09-13';

const events = [
  {
    date: '2026-10-09',
    time: '19:00',
    title: 'Infoabend: Implantate verständlich erklärt',
    venue: 'Praxis am See',
    town: 'Zürich',
  },
  {
    date: '2026-11-14',
    time: '10:00',
    title: 'Tag der offenen Tür',
    venue: 'Praxis am See',
    town: 'Zürich',
  },
  { date: '2026-08-22', title: 'Sommerapéro', venue: 'Praxis am See', town: 'Zürich' },
];

const meta: Meta<typeof EventsSection> = {
  title: 'Sections/EventsSection',
  component: EventsSection,
  parameters: { layout: 'fullscreen' },
  args: { title: 'Termine', events, today, locale: 'de-CH', surface: false },
};
export default meta;
type Story = StoryObj<typeof EventsSection>;

export const Default: Story = {};

export const OnSurface: Story = { args: { surface: true } };

/** Between seasons: the section stays, with the empty-state message. */
export const BetweenSeasons: Story = { args: { today: '2028-01-01' } };

/** A site that never entered an event has no Termine section at all. */
export const NoEvents: Story = { args: { events: [] } };
