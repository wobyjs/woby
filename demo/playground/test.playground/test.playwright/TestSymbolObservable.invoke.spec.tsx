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

// Augment window type for test observables
declare global {
    interface Window {
        testSymbolObservableInvoke: import('woby').Observable<symbol>
    }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('Symbol Observable Invoke component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Dynamic component with useInterval - expose observables globally for testing
        // Source has an observable that holds Symbol values
        // Expected output: <p><!----></p> (empty with reactive placeholder)

        // Create the component element using h() function - dynamic content
        const o = $(Symbol())
        window.testSymbolObservableInvoke = o  // Expose globally for testing access

        // Define the randomize function
        const randomize = () => o(Symbol())

        const element = h('div', null,
            h('h3', null, 'Symbol - Observable'),
            h('p', null, o)  // Observable content showing symbol
        )

        // Render to body
        render(element, document.body)
    })

    // Dynamic test verification - step-by-step
    const paragraph = page.locator('p')

    // Initial state - should show empty paragraph with reactive placeholder
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<!---->')  // Expected output from source

    // Step 1: Change symbol value
    await page.evaluate(() => {
        const o = window.testSymbolObservableInvoke
        const randomize = () => o(Symbol())
        randomize()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<!---->')  // Still shows placeholder

    // Step 2: Change symbol value again
    await page.evaluate(() => {
        const o = window.testSymbolObservableInvoke
        const randomize = () => o(Symbol())
        randomize()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<!---->')  // Still shows placeholder
})