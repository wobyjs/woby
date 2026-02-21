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
        testSymbolFunction: any
    }
}

test('Symbol - Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, h, render } = woby

        // Component logic extracted from source file
        // Dynamic content - uses useInterval to cycle through Symbol values
        // [Implementation based on source file: TestSymbolFunction.tsx]

        const o = $(Symbol())
        window.testSymbolFunction = o  // Make observable accessible globally
        const randomize = () => o(Symbol())

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('h3', null, 'Symbol - Function'),
            h('p', null, o)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should render empty content for Symbol
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<!---->')

    // Step 1: manually trigger randomize function
    await page.evaluate(() => {
        const o = window.testSymbolFunction
        const randomize = () => o(Symbol())
        randomize()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<!---->')

    // Step 2: manually trigger randomize function again
    await page.evaluate(() => {
        const o = window.testSymbolFunction
        const randomize = () => o(Symbol())
        randomize()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<!---->')
})
