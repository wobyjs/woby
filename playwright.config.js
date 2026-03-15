// @ts-check

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './test',
    testMatch: /.*\.spec\.(ts|tsx)$/,
    timeout: 90 * 1000, // 90 seconds total timeout
    expect: {
        timeout: 10000 // 10 seconds for assertions
    },
    fullyParallel: false, // Run tests sequentially since they share the dev server
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // Single worker to avoid port conflicts
    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report' }],
    ],
    use: {
        actionTimeout: 0,
        baseURL: 'http://localhost:5276',
        headless: true,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // Temporarily disabled - run 'pnpm exec playwright install' to enable other browsers
        // {
        //     name: 'firefox',
        //     use: { ...devices['Desktop Firefox'] },
        // },
        // {
        //     name: 'webkit',
        //     use: { ...devices['Desktop Safari'] },
        // },
    ],
    preserveOutput: 'failures-only',
    // No webServer config - tests manage their own dev server with dynamic ports
});