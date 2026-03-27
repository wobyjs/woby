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
        testBooleanObservable: import("woby").Observable<boolean>
    }
}

test('Boolean - Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic from TestBooleanObservable.tsx
        const o = $(true)
        window.testBooleanObservable = o
        const toggle = () => o(prev => !prev)

        const element = h('div', null,
            h('h3', null, 'Boolean - Observable'),
            h('p', null, o)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should be true
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('<!---->')

    // Step 1: true -> false
    await page.evaluate(() => {
        const o = window.testBooleanObservable
        const toggle = () => o(prev => !prev)
        toggle()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('<!---->')

    // Step 2: false -> true
    await page.evaluate(() => {
        const o = window.testBooleanObservable
        const toggle = () => o(prev => !prev)
        toggle()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('<!---->')
})
