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
        testBooleanRemoval: import("woby").Observable<boolean | null>
    }
}

test('Boolean - Removal component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic from TestBooleanRemoval.tsx
        const o = $<boolean | null>(true)
        window.testBooleanRemoval = o
        const toggle = () => o(prev => prev ? null : true)

        const element = h('div', null,
            h('h3', null, 'Boolean - Removal'),
            h('p', null, o)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should be true -> placeholder
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('<!---->')

    // Step 1: true -> null
    await page.evaluate(() => {
        const o = window.testBooleanRemoval
        const toggle = () => o(prev => prev ? null : true)
        toggle()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('<!---->')

    // Step 2: null -> true
    await page.evaluate(() => {
        const o = window.testBooleanRemoval
        const toggle = () => o(prev => prev ? null : true)
        toggle()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('<!---->')
})
