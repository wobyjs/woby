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
        testTestChildOverReexecution: import("woby").Observable<number>
    }
}

test('Child - OverReexecution component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, useEffect, h, render } = woby

        // Create component logic based on TestChildOverReexecution.tsx
        const count = $(0)
        const increment = () => count(prev => Math.min(3, prev + 1))
        window.testTestChildOverReexecution = count
        const executions = 0

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Child - OverReexecution'),
            h('div', null, executions + 1),
            h('p', null, count)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const div = page.locator('div').nth(1)  // The div containing the count
    const paragraph = page.locator('p')

    // Initial state: count should be 0
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('0')

    // Step 1: increment count -> 1
    await page.evaluate(() => {
        const count = window.testTestChildOverReexecution
        const increment = () => count(prev => Math.min(3, prev + 1))
        increment()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('1')

    // Step 2: increment count -> 2
    await page.evaluate(() => {
        const count = window.testTestChildOverReexecution
        const increment = () => count(prev => Math.min(3, prev + 1))
        increment()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('2')

    // Step 3: increment count -> 3 (max)
    await page.evaluate(() => {
        const count = window.testTestChildOverReexecution
        const increment = () => count(prev => Math.min(3, prev + 1))
        increment()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('3')

    // Step 4: Should not increment beyond 3
    await page.evaluate(() => {
        const count = window.testTestChildOverReexecution
        const increment = () => count(prev => Math.min(3, prev + 1))
        increment()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('3')
})
