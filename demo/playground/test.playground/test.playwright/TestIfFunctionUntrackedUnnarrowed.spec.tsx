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
        testIfFunctionUntrackedUnnarrowed: import('woby').Observable<number>
    }
}

test('If - Function Untracked Unnarrowed component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, h, render, If } = woby

        // Component logic extracted from source file
        // Dynamic content - uses useInterval to cycle through values 0,1,2
        // [Implementation based on source file: TestIfFunctionUntrackedUnnarrowed.tsx]

        const o = $(true)
        const content = $(0)
        window.testIfFunctionUntrackedUnnarrowed = content  // Make observable accessible globally
        const increment = () => content(prev => (prev + 1) % 3)

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('h3', null, 'If - Function Untracked Unnarrowed'),
            h('p', null, '(',
                h(If, { when: o, children: () => $$(content).toString() } as any),
                ')'
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should be '(0)'
    await page.waitForTimeout(50)
    let text = await paragraph.textContent()
    await expect(text).toBe('(0)')

    // Step 1: manually trigger increment function
    await page.evaluate(() => {
        const content = window.testIfFunctionUntrackedUnnarrowed
        const increment = () => content(prev => (prev + 1) % 3)
        increment()
    })
    await page.waitForTimeout(50)
    text = await paragraph.textContent()
    await expect(text).toBe('(1)')

    // Step 2: manually trigger increment function
    await page.evaluate(() => {
        const content = window.testIfFunctionUntrackedUnnarrowed
        const increment = () => content(prev => (prev + 1) % 3)
        increment()
    })
    await page.waitForTimeout(50)
    text = await paragraph.textContent()
    await expect(text).toBe('(2)')

    // Step 3: manually trigger increment function (should cycle back to 0)
    await page.evaluate(() => {
        const content = window.testIfFunctionUntrackedUnnarrowed
        const increment = () => content(prev => (prev + 1) % 3)
        increment()
    })
    await page.waitForTimeout(50)
    text = await paragraph.textContent()
    await expect(text).toBe('(0)')
})
