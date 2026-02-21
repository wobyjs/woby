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
        testSymbolObservable: import("woby").Observable<symbol>
    }
}

test('Symbol - Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $(Symbol())
        window.testSymbolObservable = o  // Make observable accessible globally
        const randomize = () => o(Symbol())

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Symbol - Observable'),
            h('p', null, o)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: Symbol should render as empty placeholder
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('<!---->')

    // Step 1: Randomize symbol
    await page.evaluate(() => {
        const o = window.testSymbolObservable
        const randomize = () => o(Symbol())
        randomize()
    })
    await page.waitForTimeout(50)
    const innerHTML2 = await paragraph.innerHTML()
    await expect(innerHTML2).toBe('<!---->')
})
