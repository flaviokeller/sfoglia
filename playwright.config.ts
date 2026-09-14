import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke tests only.
 *
 * For a static marketing site the highest-value test by a wide margin is "does
 * it build and do the pages actually work". We do not unit-test content.
 *
 * Runs against the real production build served by tests/static-server.mjs —
 * not the dev server — so build-time regressions (tree-shaken scripts, broken
 * image pipeline, missing routes) are caught.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['html'], ['list']] : 'list',

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  webServer: {
    command: 'npm run build --workspace=apps/site && node tests/static-server.mjs',
    url: 'http://localhost:4321/de/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
