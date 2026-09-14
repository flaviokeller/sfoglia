import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Foundations/Tokens',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

const COLOUR_ROLES = [
  'color-canvas',
  'color-surface',
  'color-surface-raised',
  'color-surface-sunken',
  'color-text',
  'color-text-muted',
  'color-text-subtle',
  'color-accent',
  'color-accent-hover',
  'color-accent-soft',
  'color-border',
  'color-border-strong',
  'color-success',
  'color-danger',
];

const SPACE_STEPS = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

export const Colours: Story = {
  render: () => ({
    setup: () => ({ roles: COLOUR_ROLES }),
    template: `
      <div class="container stack">
        <h2 class="heading-2">Colour roles</h2>
        <p class="lead">
          Only these semantic roles may be used in components. Raw ramps stay private to
          <code>theme.css</code>. Flip the toolbar theme switch — every role remaps, and no
          component CSS changes.
        </p>
        <div class="grid grid--auto">
          <div v-for="role in roles" :key="role"
               style="display:flex;align-items:center;gap:var(--space-sm)">
            <div :style="{
                   inlineSize:'3rem', blockSize:'3rem',
                   borderRadius:'var(--radius-md)',
                   border:'1px solid var(--color-border)',
                   background: 'var(--' + role + ')'
                 }"></div>
            <code style="font-size:var(--text-sm)">--{{ role }}</code>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Typography: Story = {
  render: () => ({
    template: `
      <div class="container stack">
        <h2 class="heading-2">Type scale</h2>
        <p class="lead">
          Fluid via <code>clamp()</code> — resize the preview and the scale moves with it.
          No breakpoints involved.
        </p>
        <p class="eyebrow">Eyebrow</p>
        <p class="heading-hero">Zahnarztpraxis am See</p>
        <p class="heading-1">Heading 1</p>
        <p class="heading-2">Heading 2</p>
        <p class="heading-3">Heading 3</p>
        <p class="heading-4">Heading 4</p>
        <p class="lead">Lead paragraph — used for the opening line of a section.</p>
        <p style="max-inline-size:var(--measure)">
          Body copy, capped at <code>--measure</code> (65ch) so line length stays readable.
          Text is set in Inter Variable, headings in Fraunces Variable — both self-hosted via
          npm, so the page makes no third-party requests.
        </p>
        <p class="text-muted">Muted body copy for secondary information.</p>
      </div>
    `,
  }),
};

export const Spacing: Story = {
  render: () => ({
    setup: () => ({ steps: SPACE_STEPS }),
    template: `
      <div class="container stack">
        <h2 class="heading-2">Spacing scale</h2>
        <div class="stack">
          <div v-for="step in steps" :key="step"
               style="display:flex;align-items:center;gap:var(--space-md)">
            <code style="inline-size:8rem;font-size:var(--text-sm)">--space-{{ step }}</code>
            <div :style="{
                   blockSize:'1rem',
                   inlineSize:'var(--space-' + step + ')',
                   background:'var(--color-accent)',
                   borderRadius:'var(--radius-sm)'
                 }"></div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Elevation: Story = {
  render: () => ({
    setup: () => ({ levels: ['sm', 'md', 'lg'] }),
    template: `
      <div class="container">
        <div class="grid grid--auto">
          <div v-for="level in levels" :key="level"
               :style="{
                 padding:'var(--space-xl)',
                 borderRadius:'var(--radius-lg)',
                 background:'var(--color-surface-raised)',
                 boxShadow:'var(--shadow-' + level + ')'
               }">
            <code>--shadow-{{ level }}</code>
          </div>
        </div>
      </div>
    `,
  }),
};
