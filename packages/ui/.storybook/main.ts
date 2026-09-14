import type { StorybookConfig } from '@storybook/vue3-vite';
import vue from '@vitejs/plugin-vue';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [],
  core: { disableTelemetry: true },
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  // Storybook is deployed as its own Netlify site, served from the root.
  staticDirs: ['./public'],

  // @storybook/vue3-vite does not ship @vitejs/plugin-vue itself — without this,
  // .vue files are handed to the JS parser and fail as "Unexpected JSX expression".
  viteFinal: (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), vue()];
    return viteConfig;
  },
};

export default config;
