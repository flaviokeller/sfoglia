import type { Preview } from '@storybook/vue3-vite';
import '../src/styles/global.css';

/**
 * The theme switcher writes `data-theme` on <html>, which is exactly the
 * mechanism the real site uses — so what you see in Storybook is what ships.
 */
const withTheme = (story: () => unknown, context: { globals: { theme?: string } }) => {
  const theme = context.globals.theme ?? 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.body.style.backgroundColor = 'var(--color-canvas)';
  document.body.style.color = 'var(--color-text)';
  document.body.style.padding = '2rem';
  return story();
};

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: ['Foundations', 'Primitives', 'Components'],
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
