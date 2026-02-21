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
        testTestClassesObjectRemoval: import("woby").Observable<Record<string, boolean>>
    }
}

test('Classes - Object Removal component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create component logic based on TestClassesObjectRemoval.tsx
        // Dynamic component with object class removal

        const o = $({ red: true, blue: false })
        window.testTestClassesObjectRemoval = o
        const toggle = () => o(prev => prev ? null : { red: true, blue: false })

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Classes - Object Removal'),
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

    // Step 1: toggle class -> null (empty class)
    await page.evaluate(() => {
        const o = window.testTestClassesObjectRemoval
        const toggle = () => o(prev => prev ? null : { red: true, blue: false })
        toggle()
    })
    await page.waitForTimeout(50)
    const className2 = await paragraph.getAttribute('class')
    await expect(className2).toBe('')

    // Step 2: toggle class -> 'red'
    await page.evaluate(() => {
        const o = window.testTestClassesObjectRemoval
        const toggle = () => o(prev => prev ? null : { red: true, blue: false })
        toggle()
    })
    await page.waitForTimeout(50)
    const className3 = await paragraph.getAttribute('class')
    await expect(className3).toBe('red')
})
