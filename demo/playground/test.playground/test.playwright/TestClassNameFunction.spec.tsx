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
        testClassNameFunction: import("woby").Observable<string>
    }
}

test('ClassName - Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, h, render } = woby

        // Create component logic based on TestClassNameFunction.tsx
        // Dynamic component with function class name

        const o = $('red')
        window.testClassNameFunction = o
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'ClassName - Function'),
            h('p', { class: () => $$(o) } as any, 'content')
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

    // Step 1: toggle class -> 'blue'
    await page.evaluate(() => {
        const o = window.testClassNameFunction
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
        toggle()
    })
    await page.waitForTimeout(50)
    const className2 = await paragraph.getAttribute('class')
    await expect(className2).toBe('blue')

    // Step 2: toggle class -> 'red'
    await page.evaluate(() => {
        const o = window.testClassNameFunction
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
        toggle()
    })
    await page.waitForTimeout(50)
    const className3 = await paragraph.getAttribute('class')
    await expect(className3).toBe('red')

    // Step 3: toggle class -> 'blue' (verify cycle)
    await page.evaluate(() => {
        const o = window.testClassNameFunction
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
        toggle()
    })
    await page.waitForTimeout(50)
    const className4 = await paragraph.getAttribute('class')
    await expect(className4).toBe('blue')

    // Step 4: toggle class -> 'red' (complete cycle)
    await page.evaluate(() => {
        const o = window.testClassNameFunction
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
        toggle()
    })
    await page.waitForTimeout(50)
    const className5 = await paragraph.getAttribute('class')
    await expect(className5).toBe('red')
})
