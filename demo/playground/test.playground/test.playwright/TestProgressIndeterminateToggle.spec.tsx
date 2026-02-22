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
        testProgressIndeterminateToggle: import('woby').Observable<number | null | undefined>
    }
}

test('Progress - Indeterminate Toggle component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, $$ } = woby

        // Implement component logic based on TestProgressIndeterminateToggle.tsx
        const element = h(TestProgressIndeterminateToggle, null)

        function TestProgressIndeterminateToggle() {
            const o = $<number | null | undefined>(.25)
            window.testProgressIndeterminateToggle = o  // Store observable for testing
            const values = [.25, null, .5, undefined]
            const cycle = () => o(prev => values[(values.indexOf(prev) + 1) % values.length])
            // Note: We're not using interval for the static test
            return [
                h('h3', null, 'Progress - Indeterminate Toggle'),
                h('progress', { value: o })
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const progress = page.locator('progress')

    // Initial state verification
    await page.waitForTimeout(50)

    // Check the initial value
    const value = await progress.evaluate(el => el.hasAttribute('value') ? el.getAttribute('value') : null)
    await expect(value).toBe('0.25')

    // Verify the exact HTML structure
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    const expectedHTML = '<h3>Progress - Indeterminate Toggle</h3><progress value="0.25"></progress>'
    await expect(bodyHTML).toBe(expectedHTML)

    // Verify the observable value
    const observableValue = await page.evaluate(() => window.testProgressIndeterminateToggle())
    await expect(observableValue).toBe(0.25)
})

