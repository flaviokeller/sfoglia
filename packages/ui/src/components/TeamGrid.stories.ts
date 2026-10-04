import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { placeholderImage } from '../stories/placeholder';
import TeamGrid from './TeamGrid.vue';

const photo = (hue: number, alt: string) => placeholderImage(hue, alt, 400, 500);

const anna = {
  name: 'Dr. med. dent. Anna Meier',
  role: 'Praxisinhaberin',
  bio: 'Schwerpunkt Implantologie. Seit 2009 in eigener Praxis.',
  photo: photo(210, 'Porträt von Anna Meier'),
};

const luca = {
  name: 'Luca Brunner',
  role: 'Dentalhygieniker',
  bio: 'Prophylaxe und Zahnreinigung.',
  photo: photo(30, 'Porträt von Luca Brunner'),
};

const sara = {
  name: 'Sara Keller',
  role: 'Praxisassistentin',
  photo: photo(120, 'Porträt von Sara Keller'),
};

const members = [anna, luca, sara];

const meta: Meta<typeof TeamGrid> = {
  title: 'Sections/TeamGrid',
  component: TeamGrid,
  parameters: { layout: 'fullscreen' },
  args: { title: 'Unser Team', members },
};
export default meta;
type Story = StoryObj<typeof TeamGrid>;

export const Default: Story = {};

/** Nobody has a photo: the cards stay text-only. */
export const NoPhotos: Story = {
  args: { members: members.map(({ photo: _photo, ...rest }) => rest) },
};

/** Only some have a photo: the rest get an initials tile so the grid stays even. */
export const MixedPhotos: Story = {
  args: { members: [anna, { ...luca, photo: undefined }, sara] },
};

export const SingleMember: Story = { args: { members: [anna] } };

/** The grid is the page itself (Team): h1 title, member names drop to h2. */
export const AsPage: Story = { args: { as: 'h1' } };

export const OnSurface: Story = { args: { surface: true } };

export const Empty: Story = { args: { members: [] } };
