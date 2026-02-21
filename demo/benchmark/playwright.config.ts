import { defineConfig } from '@playwright/test'

export default defineConfig({
    webServer: {
        command: 'pnpm run dev', // Using Vite dev server command
        url: 'http://localhost:9199',
        reuseExistingServer: !process.env.CI, // reuse if already running
        stdout: 'ignore',
        stderr: 'pipe',
    },
})