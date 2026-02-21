import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './test.playwright',
    testMatch: /.*\.spec\.(ts|tsx)$/,

    webServer: {
        command: 'pnpm dev', // Using Vite dev server command
        url: 'http://localhost:5176',

        reuseExistingServer: !process.env.CI, // reuse if already running
        stdout: 'ignore',
        stderr: 'pipe',
    },
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