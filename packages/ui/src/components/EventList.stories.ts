import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EventList from './EventList.vue';

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
    url: 'https://example.ch/tag-der-offenen-tuer',
  },
  {
    date: '2027-01-22',
    title: 'Vortrag: Prophylaxe im Alltag',
    venue: 'Gemeindesaal',
    town: 'Küsnacht',
  },
  {
    date: '2026-08-22',
    time: '18:30',
    title: 'Sommerapéro',
    venue: 'Praxis am See',
    town: 'Zürich',
  },
];

const meta: Meta<typeof EventList> = {
  title: 'Components/EventList',
  component: EventList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "`today` drives the server render deterministically; the site sets `live` so the upcoming/past split re-derives from the visitor's clock on hydration. Past events drop off after `pastWindowDays` (default 90).",
      },
    },
  },
  args: { events, today, locale: 'de-CH', showPast: true },
  render: (args) => ({
    components: { EventList },
    setup: () => ({ args }),
    template: '<div style="max-inline-size:44rem"><EventList v-bind="args" /></div>',
  }),
};
export default meta;
type Story = StoryObj<typeof EventList>;

export const Default: Story = {};

export const UpcomingOnly: Story = { args: { showPast: false } };

/** Between seasons — the state that actually needs a designed answer. */
export const Empty: Story = { args: { events: events.filter((e) => e.date < today) } };

export const NoEventsAtAll: Story = { args: { events: [] } };

/** A year on with no rebuild: everything is past the 90-day window and gone. */
export const AllPast: Story = { args: { today: '2028-01-01' } };

/** Editor left venue or town empty: no dangling comma, no empty line. */
export const EditorContent: Story = {
  args: {
    events: [
      { date: '2026-10-01', title: 'Nur Ort', town: 'Zürich' },
      { date: '2026-10-02', title: 'Ohne Ort' },
    ],
  },
};

export const English: Story = {
  args: {
    locale: 'en-GB',
    labels: { past: 'Past dates', empty: 'No dates are currently planned.' },
  },
};
