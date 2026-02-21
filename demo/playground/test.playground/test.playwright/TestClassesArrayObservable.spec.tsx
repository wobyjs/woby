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
        testClassesArrayObservable: import('woby').Observable<(string | boolean)[]>
    }
}

test('Classes - Array Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic from TestClassesArrayObservable.tsx
        const o = $(['red', false])
        window.testClassesArrayObservable = o
        const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red', false])

        const element = h('div', null,
            h('h3', null, 'Classes - Array Observable'),
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

    // Step 1: manually trigger toggle to [false, 'blue']
    await page.evaluate(() => {
        const o = window.testClassesArrayObservable
        const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red', false])
        toggle()
    })
    await page.waitForTimeout(50)
    const updatedClass = await paragraph.evaluate(el => el.className)
    await expect(updatedClass).toContain('blue')
    await expect(updatedClass).not.toContain('red')

    // Step 2: manually trigger toggle back to ['red', false]
    await page.evaluate(() => {
        const o = window.testClassesArrayObservable
        const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red', false])
        toggle()
    })
    await page.waitForTimeout(50)
    const finalClass = await paragraph.evaluate(el => el.className)
    await expect(finalClass).toContain('red')
    await expect(finalClass).not.toContain('blue')
})
