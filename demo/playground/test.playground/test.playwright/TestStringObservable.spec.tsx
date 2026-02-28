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
        testStringObservable: import("woby").Observable<string>
    }
}

test('String - Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $(String(Math.random()))
        window.testStringObservable = o  // Make observable accessible globally
        const randomize = () => o(String(Math.random()))

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'String - Observable'),
            h('p', null, o)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should be a string representation of a number
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toMatch(/^\d+\.\d+$/)

    // Step 1: Randomize string
    await page.evaluate(() => {
        const o = window.testStringObservable
        const randomize = () => o(String(Math.random()))
        randomize()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toMatch(/^\d+\.\d+$/)

    // Step 2: Randomize string again
    await page.evaluate(() => {
        const o = window.testStringObservable
        const randomize = () => o(String(Math.random()))
        randomize()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toMatch(/^\d+\.\d+$/)
})
