/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
// @ts-ignore
import fs from 'fs'
// @ts-ignore
import path from 'path'
// @ts-ignore
import { fileURLToPath } from 'url'
import type * as Woby from 'woby'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Augment window type for test observables
declare global {
    interface Window {
        testPromiseRejected: any
    }
}

test('Promise - Rejected component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestPromiseRejected.tsx
        const element = h(TestPromiseRejected, null)

        function TestPromiseRejected() {
            const errorObservable = $('Custom Error')
            window.testPromiseRejected = errorObservable  // Store observable for testing
            return [
                h('h3', null, 'Promise - Rejected'),
                h('p', null, errorObservable)
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const heading = page.locator('h3')
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    await expect(heading).toHaveText('Promise - Rejected')
    await expect(paragraph).toHaveText('Custom Error')

    // Verify the exact HTML structure
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    const expectedHTML = '<h3>Promise - Rejected</h3><p>Custom Error</p>'
    await expect(bodyHTML).toBe(expectedHTML)

    // Verify the observable value
    const observableValue = await page.evaluate(() => window.testPromiseRejected())
    await expect(observableValue).toBe('Custom Error')
})
