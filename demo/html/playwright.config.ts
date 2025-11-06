import { defineConfig } from '@playwright/test'

export default defineConfig({
    webServer: {
        command: 'pnpm dev', // Using Vite dev server command
        url: 'http://localhost:5173',

        reuseExistingServer: !process.env.CI, // reuse if already running
        stdout: 'ignore',
        stderr: 'pipe',
    },
})