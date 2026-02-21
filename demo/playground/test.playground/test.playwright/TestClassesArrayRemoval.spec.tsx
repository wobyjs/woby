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
        testClassesArrayRemoval: import('woby').Observable<(string | boolean | null)[] | null>
    }
}

test('Classes - Array Removal component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic from TestClassesArrayRemoval.tsx
        const o = $<any>(['red', false])
        window.testClassesArrayRemoval = o
        const toggle = () => o(prev => prev ? null : ['red', false])

        const element = h('div', null,
            h('h3', null, 'Classes - Array Removal'),
            h('p', { class: o } as any, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification - should have 'red' class
    await page.waitForTimeout(50)
    const initialClass = await paragraph.evaluate(el => el.className)
    await expect(initialClass).toContain('red')

    // Step 1: manually trigger toggle to null
    await page.evaluate(() => {
        const o = window.testClassesArrayRemoval
        const toggle = () => o(prev => prev ? null : ['red', false])
        toggle()
    })
    await page.waitForTimeout(50)
    const updatedClass = await paragraph.evaluate(el => el.className)
    await expect(updatedClass).toBe('')

    // Step 2: manually trigger toggle back to ['red', false]
    await page.evaluate(() => {
        const o = window.testClassesArrayRemoval
        const toggle = () => o(prev => prev ? null : ['red', false])
        toggle()
    })
    await page.waitForTimeout(50)
    const finalClass = await paragraph.evaluate(el => el.className)
    await expect(finalClass).toContain('red')
})
