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
        testTestClassesArrayStaticMultiple: import("woby").Observable<string>
    }
}

test('Classes - Array Static Multiple component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create component logic based on TestClassesArrayStaticMultiple.tsx
        // Static component with array classes

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Classes - Array Static Multiple'),
            h('p', { class: ['red bold'] }, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: class should be 'red bold'
    await page.waitForTimeout(50)
    const className = await paragraph.getAttribute('class')
    await expect(className).toBe('red bold')

    const innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('content')

    // Verify the full structure
    const body = page.locator('body')
    const bodyHTML = await body.innerHTML()
    const expectedHTML = '<div><h3>Classes - Array Static Multiple</h3><p class="red bold">content</p></div>'
    await expect(bodyHTML.replace(/\s+/g, '')).toBe(expectedHTML.replace(/\s+/g, ''))
})
