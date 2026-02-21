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
        testClassesArrayObservableValue: import('woby').Observable<string>
    }
}

test('Classes - Array Observable Value component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, h, render } = woby

        // Component logic from TestClassesArrayObservableValue.tsx
        const o = $('red')
        window.testClassesArrayObservableValue = o
        const toggle = () => o(prev => prev === 'red' ? 'blue' : 'red')

        const element = h('div', null,
            h('h3', null, 'Classes - Array Observable Value'),
            h('p', { class: [o] } as any, o)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification - should have 'red' class and text
    await page.waitForTimeout(50)
    const initialClass = await paragraph.evaluate(el => el.className)
    const initialText = await paragraph.evaluate(el => el.textContent)
    await expect(initialClass).toBe('red')
    await expect(initialText).toBe('red')

    // Step 1: manually trigger toggle to 'blue'
    await page.evaluate(() => {
        const o = window.testClassesArrayObservableValue
        const toggle = () => o(prev => prev === 'red' ? 'blue' : 'red')
        toggle()
    })
    await page.waitForTimeout(50)
    const updatedClass = await paragraph.evaluate(el => el.className)
    const updatedText = await paragraph.evaluate(el => el.textContent)
    await expect(updatedClass).toBe('blue')
    await expect(updatedText).toBe('blue')

    // Step 2: manually trigger toggle back to 'red'
    await page.evaluate(() => {
        const o = window.testClassesArrayObservableValue
        const toggle = () => o(prev => prev === 'red' ? 'blue' : 'red')
        toggle()
    })
    await page.waitForTimeout(50)
    const finalClass = await paragraph.evaluate(el => el.className)
    const finalText = await paragraph.evaluate(el => el.textContent)
    await expect(finalClass).toBe('red')
    await expect(finalText).toBe('red')
})
