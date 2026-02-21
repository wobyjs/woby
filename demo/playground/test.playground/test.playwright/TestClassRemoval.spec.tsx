/** @jsxImportSource woby */
// @ts-ignore
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
        testClassRemoval: import('woby').Observable<string | null>
    }
}

test('Class - Removal component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create component logic based on TestClassRemoval.tsx
        // Dynamic component with class removal

        const o = $(true)
        window.testClassRemoval = o
        const toggle = () => o(prev => prev ? null : true)

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Class - Removal'),
            h('p', { class: { red: o } } as any, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: class should be 'red' (since o is true)
    await page.waitForTimeout(50)
    const className = await paragraph.getAttribute('class')
    await expect(className).toBe('red')

    // Step 1: toggle class -> '' (empty, since o becomes null)
    await page.evaluate(() => {
        const o = window.testClassRemoval
        const toggle = () => o(prev => prev ? null : true)
        toggle()
    })
    await page.waitForTimeout(50)
    const className2 = await paragraph.getAttribute('class')
    await expect(className2).toBe('')

    // Step 2: toggle class -> 'red' (since o becomes true again)
    await page.evaluate(() => {
        const o = window.testClassRemoval
        const toggle = () => o(prev => prev ? null : true)
        toggle()
    })
    await page.waitForTimeout(50)
    const className3 = await paragraph.getAttribute('class')
    await expect(className3).toBe('red')
})

