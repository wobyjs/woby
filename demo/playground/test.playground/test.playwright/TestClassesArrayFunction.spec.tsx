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
        testClassesArrayFunction: import('woby').Observable<(string | boolean)[]>
    }
}

test('Classes - Array Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $(['red', false])
        window.testClassesArrayFunction = o  // Make observable accessible globally
        const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red', false])

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Classes - Array Function'),
            h('p', { class: () => o().filter(v => v && v !== false).join(' ') }, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Step 1: Verify initial state - should have 'red' class
    await page.waitForTimeout(50)
    let currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toContain('red')

    // Step 2: Manually trigger toggle function
    await page.evaluate(() => {
        const o = window.testClassesArrayFunction
        const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red', false])
        toggle()
    })
    await page.waitForTimeout(50)
    currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toContain('blue')
    await expect(currentClass).not.toContain('red')

    // Step 3: Manually trigger toggle function again
    await page.evaluate(() => {
        const o = window.testClassesArrayFunction
        const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red', false])
        toggle()
    })
    await page.waitForTimeout(50)
    currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toContain('red')
    await expect(currentClass).not.toContain('blue')

    // Step 4: Verify toggle cycle works
    await page.evaluate(() => {
        const o = window.testClassesArrayFunction
        const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red', false])
        toggle()
    })
    await page.waitForTimeout(50)
    currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toContain('blue')
    await expect(currentClass).not.toContain('red')
})
