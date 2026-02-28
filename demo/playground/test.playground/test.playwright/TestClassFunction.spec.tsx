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
        testClassFunction: import('woby').Observable<boolean>
    }
}

test('Class - Function Boolean component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, h, render } = woby

        // Create the component logic based on source
        const o = $(true)
        window.testClassFunction = o  // Make observable accessible globally
        const toggle = () => o(prev => !prev)

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Class - Function Boolean'),
            h('p', { class: { red: () => $$(o) } } as any, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step 1: Verify initial state - should have 'red' class (true)
    const paragraph = page.locator('p')
    let currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toBe('red')

    // Step 2: Manually trigger toggle function
    await page.evaluate(() => {
        const o = window.testClassFunction
        const toggle = () => o(prev => !prev)
        toggle()
    })
    await page.waitForTimeout(50)
    currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toBe('')

    // Step 3: Manually trigger toggle function again
    await page.evaluate(() => {
        const o = window.testClassFunction
        const toggle = () => o(prev => !prev)
        toggle()
    })
    await page.waitForTimeout(50)
    currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toBe('red')

    // Step 4: Verify toggle cycle works
    await page.evaluate(() => {
        const o = window.testClassFunction
        const toggle = () => o(prev => !prev)
        toggle()
    })
    await page.waitForTimeout(50)
    currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toBe('')
})
