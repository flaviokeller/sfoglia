import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Primitives/Catalogue',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const Buttons: Story = {
  render: () => ({
    template: `
      <div class="container stack">
        <h2 class="heading-2">Buttons</h2>
        <div style="display:flex;flex-wrap:wrap;gap:var(--space-md);align-items:center">
          <button class="button button--primary">Termin vereinbaren</button>
          <button class="button button--secondary">Mehr erfahren</button>
          <button class="button button--ghost">Abbrechen</button>
          <button class="button button--primary" disabled>Nicht verfügbar</button>
        </div>
        <h3 class="heading-3">Sizes</h3>
        <div style="display:flex;flex-wrap:wrap;gap:var(--space-md);align-items:center">
          <button class="button button--primary button--sm">Small</button>
          <button class="button button--primary">Base</button>
          <button class="button button--primary button--lg">Large</button>
        </div>
        <h3 class="heading-3">As a link</h3>
        <a class="button button--primary" href="#0">Anchors take the same classes</a>
      </div>
    `,
  }),
};

export const Cards: Story = {
  render: () => ({
    template: `
      <div class="container">
        <div class="grid grid--auto">
          <div class="card">
            <span class="badge">Neu</span>
            <h3 class="heading-4">Prophylaxe</h3>
            <p class="text-muted">Professionelle Zahnreinigung für langfristige Mundgesundheit.</p>
          </div>
          <div class="card card--interactive">
            <h3 class="heading-4">Interactive card</h3>
            <p class="text-muted">Hover me — lifts on <code>--shadow-md</code>.</p>
          </div>
          <div class="card">
            <h3 class="heading-4">Implantologie</h3>
            <p class="text-muted">Festsitzender Zahnersatz, der sich natürlich anfühlt.</p>
            <a class="link" href="#0">Mehr dazu →</a>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Badges: Story = {
  render: () => ({
    template: `
      <div class="container" style="display:flex;gap:var(--space-sm);flex-wrap:wrap">
        <span class="badge">Accent</span>
        <span class="badge badge--neutral">Neutral</span>
        <span class="badge badge--success">Geöffnet</span>
      </div>
    `,
  }),
};

export const FormFields: Story = {
  render: () => ({
    template: `
      <div class="container stack" style="max-inline-size:32rem">
        <h2 class="heading-2">Form fields</h2>
        <div class="field">
          <label class="field__label" for="demo-name">Name</label>
          <input class="input" id="demo-name" type="text" placeholder="Maria Muster" />
        </div>
        <div class="field">
          <label class="field__label" for="demo-email">E-Mail</label>
          <input class="input" id="demo-email" type="email" aria-invalid="true"
            aria-describedby="demo-email-error" value="nicht-valide" />
          <p class="field__error" id="demo-email-error">
            Bitte geben Sie eine gültige E-Mail-Adresse ein.
          </p>
        </div>
        <div class="field">
          <label class="field__label" for="demo-topic">Anliegen</label>
          <select class="select" id="demo-topic">
            <option>Terminanfrage</option>
            <option>Allgemeine Frage</option>
          </select>
          <p class="field__hint">Wir melden uns innerhalb von zwei Werktagen.</p>
        </div>
        <div class="field">
          <label class="field__label" for="demo-message">Nachricht</label>
          <textarea class="textarea" id="demo-message"></textarea>
        </div>
      </div>
    `,
  }),
};
