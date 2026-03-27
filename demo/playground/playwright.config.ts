import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './test.playwright',
    testMatch: '**/*.spec.{ts,tsx}',
    testIgnore: '**/umd x/**',

    projects: [
        {
            name: 'chromium',
            use: {
                javaScriptEnabled: true,
            },
        },
        {
            name: 'component',
            testMatch: '**/*.@(spec|test).tsx',
            use: {
                javaScriptEnabled: true,
            },
        },
    ],
})