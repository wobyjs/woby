import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './test.playwright',
    testMatch: /.*\.spec\.(ts|tsx)$/,

    // No web server needed since we're loading the library directly
    projects: [
        {
            name: 'chromium-direct',
            use: {
                javaScriptEnabled: true,
            },
        },
    ],
})