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
        testTestClassesObjectObservableMultiple: import("woby").Observable<Record<string, boolean>>
    }
}

test('Classes - Object Observable Multiple component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create component logic based on TestClassesObjectObservableMultiple.tsx
        // Dynamic component with object class toggling

        const o = $({ 'red bold': true, blue: false })
        window.testTestClassesObjectObservableMultiple = o
        const toggle = () => o(prev => prev['red bold'] ? { 'red bold': false, blue: true } : { 'red bold': true, blue: false })

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Classes - Object Observable Multiple'),
            h('p', { class: o }, 'content')
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

    // Step 1: toggle class -> 'blue'
    await page.evaluate(() => {
        const o = window.testTestClassesObjectObservableMultiple
        const toggle = () => o(prev => prev['red bold'] ? { 'red bold': false, blue: true } : { 'red bold': true, blue: false })
        toggle()
    })
    await page.waitForTimeout(50)
    const className2 = await paragraph.getAttribute('class')
    await expect(className2).toBe('blue')

    // Step 2: toggle class -> 'red bold'
    await page.evaluate(() => {
        const o = window.testTestClassesObjectObservableMultiple
        const toggle = () => o(prev => prev['red bold'] ? { 'red bold': false, blue: true } : { 'red bold': true, blue: false })
        toggle()
    })
    await page.waitForTimeout(50)
    const className3 = await paragraph.getAttribute('class')
    await expect(className3).toBe('red bold')
})
