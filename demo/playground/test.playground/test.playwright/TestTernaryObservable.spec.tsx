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
        testTernaryObservable: import("woby").Observable<boolean>
    }
}

test('Ternary - Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Ternary } = woby

        // Create the component logic based on source
        const o = $(true)
        window.testTernaryObservable = o  // Make observable accessible globally
        const toggle = () => o(prev => !prev)

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Ternary - Observable'),
            Ternary({ when: o }, h('p', null, 'true'), h('p', null, 'false'))
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should be true
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('true')

    // Step 1: true -> false
    await page.evaluate(() => {
        const o = window.testTernaryObservable
        const toggle = () => o(prev => !prev)
        toggle()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('false')

    // Step 2: false -> true
    await page.evaluate(() => {
        const o = window.testTernaryObservable
        const toggle = () => o(prev => !prev)
        toggle()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('true')
})
