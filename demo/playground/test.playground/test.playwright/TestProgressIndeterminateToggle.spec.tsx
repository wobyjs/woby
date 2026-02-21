/** @jsxImportSource woby */
import test from '@playwright/test'
import expect from '@playwright/test'
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
        testTestProgressIndeterminateToggle: import('woby').Observable<number | null | undefined>
    }
}

test('Progress - Indeterminate Toggle component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestProgressIndeterminateToggle.tsx
        const element = h(TestProgressIndeterminateToggle, null)

        function TestProgressIndeterminateToggle() {
            const o = $<number | null | undefined>(.25)
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
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // TODO: Add proper expectations based on TestProgressIndeterminateToggle.tsx
    await expect(innerHTML).not.toBe('')
})

