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
        testABCD: import('woby').Observable<number>
    }
}

test('Children - ABCD component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Dynamic content - uses useInterval to cycle through states
        // [Implementation based on source file: TestABCD.tsx]

        const states = [
            h('i', null, 'a'),
            h('u', null, 'b'),
            h('b', null, 'c'),
            h('span', null, 'd')
        ]
        const index = $(0)
        window.testABCD = index  // Make observable accessible globally
        const increment = () => index(prev => (prev + 1) % states.length)

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('h3', null, 'Children - ABCD'),
            h('p', null, () => states[index()])
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should be first element (index 0)
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<i>a</i>')

    // Step 1: increment index -> 1
    await page.evaluate(() => {
        const index = window.testABCD
        const increment = () => index(prev => (prev + 1) % 4)
        increment()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<u>b</u>')

    // Step 2: increment index -> 2
    await page.evaluate(() => {
        const index = window.testABCD
        const increment = () => index(prev => (prev + 1) % 4)
        increment()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<b>c</b>')

    // Step 3: increment index -> 3
    await page.evaluate(() => {
        const index = window.testABCD
        const increment = () => index(prev => (prev + 1) % 4)
        increment()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<span>d</span>')

    // Step 4: increment index -> 0 (back to start)
    await page.evaluate(() => {
        const index = window.testABCD
        const increment = () => index(prev => (prev + 1) % 4)
        increment()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<i>a</i>')
})
