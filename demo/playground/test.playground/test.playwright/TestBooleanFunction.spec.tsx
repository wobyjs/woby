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
        testBooleanFunction: import('woby').Observable<boolean>
    }
}

test('Boolean - Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic from TestBooleanFunction.tsx
        const o = $(true)
        window.testBooleanFunction = o
        const toggle = () => o(prev => !prev)

        const element = h('div', null,
            h('h3', null, 'Boolean - Function'),
            h('p', null, o)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should have initial boolean value
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<!---->')

    // Step 1: toggle o to false
    await page.evaluate(() => {
        const o = window.testBooleanFunction
        o(false)
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<!---->')

    // Step 2: toggle o back to true
    await page.evaluate(() => {
        const o = window.testBooleanFunction
        o(true)
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<!---->')
})
