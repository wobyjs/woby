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
        testTestComponentFunction: import('woby').Observable<undefined>
    }
}

test('Component - Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestComponentFunction.tsx
        const getRandom = (): number => Math.random()
        const o = $(getRandom())
        window.testTestComponentFunction = o
        const randomize = () => o(getRandom())

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Component - Function'),
            h('p', null, () => $$(o))
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestComponentFunction.tsx
    await expect(innerHTML).not.toBe('')
})

