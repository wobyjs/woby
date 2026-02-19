import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: ['**/test.playwright/**/*.spec.ts', '**/test.playwright/**/*.spec.tsx'],
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5176',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        // channel: 'chrome', // Use bundled chromium
      },
    },

    {
      name: 'firefox',
      use: { 
        // channel: 'firefox', // Use bundled firefox
      },
    },

    {
      name: 'webkit',
      use: { 
        // channel: 'webkit', // Use bundled webkit
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer is disabled because the dev server build fails in this environment due to missing workspace dependencies.
  // The tests use injected scripts and do not require the dev server.
  // webServer: {
  //   command: 'cd demo/playground && npx vite --port 5176',
  //   url: 'http://localhost:5176',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});