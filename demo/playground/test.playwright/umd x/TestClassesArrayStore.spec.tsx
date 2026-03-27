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
        testTestClassesArrayStore: import("woby").Observable<string>
    }
}

test('Classes - Array Store component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create component logic based on TestClassesArrayStore.tsx
        // Static component with array classes

        const o = ['red', false]

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Classes - Array Store'),
            h('p', { class: o }, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: class should be 'red'
    await page.waitForTimeout(50)
    const className = await paragraph.getAttribute('class')
    await expect(className).toBe('red')

    const innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('content')

    // Verify the full structure
    const body = page.locator('body')
    const bodyHTML = await body.innerHTML()
    const expectedHTML = '<div><h3>Classes - Array Store</h3><p class="red">content</p></div>'
    await expect(bodyHTML.replace(/\s+/g, '')).toBe(expectedHTML.replace(/\s+/g, ''))
})
