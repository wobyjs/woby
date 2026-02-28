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
        testClassesArrayFunctionValue: import('woby').Observable<string>
    }
}

test('Classes - Array Function Value component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, h, render } = woby

        // Component logic from TestClassesArrayFunctionValue.tsx
        const o = $('red')
        window.testClassesArrayFunctionValue = o
        const toggle = () => o(prev => prev === 'red' ? 'blue' : 'red')

        const element = h('div', null,
            h('h3', null, 'Classes - Array Function Value'),
            h('p', { class: [() => $$(o)] } as any, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification - should have 'red' class
    await page.waitForTimeout(50)
    const initialClass = await paragraph.evaluate(el => el.className)
    await expect(initialClass).toBe('red')

    // Step 1: manually trigger toggle to 'blue'
    await page.evaluate(() => {
        const o = window.testClassesArrayFunctionValue
        const toggle = () => o(prev => prev === 'red' ? 'blue' : 'red')
        toggle()
    })
    await page.waitForTimeout(50)
    const updatedClass = await paragraph.evaluate(el => el.className)
    await expect(updatedClass).toBe('blue')

    // Step 2: manually trigger toggle back to 'red'
    await page.evaluate(() => {
        const o = window.testClassesArrayFunctionValue
        const toggle = () => o(prev => prev === 'red' ? 'blue' : 'red')
        toggle()
    })
    await page.waitForTimeout(50)
    const finalClass = await paragraph.evaluate(el => el.className)
    await expect(finalClass).toBe('red')
})
