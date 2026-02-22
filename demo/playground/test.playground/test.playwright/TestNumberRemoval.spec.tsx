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
        testNumberRemoval: import('woby').Observable<number | null>
    }
}

test('Number - Removal component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, $$ } = woby

        // Implement component logic based on TestNumberRemoval.tsx
        const element = h(TestNumberRemoval, null)

        function TestNumberRemoval() {
            // Implement random function from util.tsx
            const random = (): number => {
                const value = Math.random()
                if (value === 0 || value === 1) return random()
                return value
            }

            const o = $<number | null>(random())
            window.testNumberRemoval = o  // Store observable for testing
            const randomize = () => o(prev => prev ? null : random())
            // Note: We're not using interval for the static test
            return [
                h('h3', null, 'Number - Removal'),
                h('p', null, '(', o, ')')
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)

    // Check that the initial value is a number (not null)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)

    // The initial value should be a number in parentheses
    // Since the initial value is random, we'll verify it's a number format
    await expect(innerHTML).toMatch(/^\([0-9.]+\)$/) // Should match (number)

    // Verify the exact HTML structure
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    // Extract the number from the HTML and verify it's in the expected format
    await expect(bodyHTML).toContain('<h3>Number - Removal</h3>')
    await expect(bodyHTML).toMatch(/<p>\([0-9.]+\)<\/p>/) // Should contain <p>(number)</p>

    // Verify the observable value
    const observableValue = await page.evaluate(() => window.testNumberRemoval())
    // The initial value should be a number, not null
    await expect(typeof observableValue).toBe('number')
    await expect(observableValue).not.toBeNull()
})

