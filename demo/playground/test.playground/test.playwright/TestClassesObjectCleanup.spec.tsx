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
        testClassesObjectCleanup: import('woby').Observable<Record<string, boolean>>
    }
}

test('Classes - Object Cleanup component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $({ red: true })
        window.testClassesObjectCleanup = o  // Make observable accessible globally
        const toggle = () => o(prev => prev.red ? { blue: true } : { red: true })

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Classes - Object Cleanup'),
            h('p', { class: o }, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step 1: Verify initial state - should have 'red' class
    const paragraph = page.locator('p')
    let currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toBe('red')

    // Step 2: Manually trigger toggle function
    await page.evaluate(() => {
        const o = window.testClassesObjectCleanup
        const toggle = () => o(prev => prev.red ? { blue: true } : { red: true })
        toggle()
    })
    await page.waitForTimeout(50)
    currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toBe('blue')
    await expect(currentClass).not.toContain('red')

    // Step 3: Manually trigger toggle function again
    await page.evaluate(() => {
        const o = window.testClassesObjectCleanup
        const toggle = () => o(prev => prev.red ? { blue: true } : { red: true })
        toggle()
    })
    await page.waitForTimeout(50)
    currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toBe('red')
    await expect(currentClass).not.toContain('blue')

    // Step 4: Verify toggle cycle works
    await page.evaluate(() => {
        const o = window.testClassesObjectCleanup
        const toggle = () => o(prev => prev.red ? { blue: true } : { red: true })
        toggle()
    })
    await page.waitForTimeout(50)
    currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toBe('blue')
    await expect(currentClass).not.toContain('red')
})
