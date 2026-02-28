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
        testClassesArrayStoreMultiple: import('woby').Observable<(string | boolean)[]>
    }
}

test('Classes - Array Store Multiple component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, store } = woby

        // Create the component logic based on source
        const o = store(['red bold', false])
        window.testClassesArrayStoreMultiple = o  // Make observable accessible globally
        let testit = true
        const toggle = () => {
            if (o[0]) {
                o[0] = false
                o[1] = 'blue'
            } else {
                o[0] = 'red bold'
                o[1] = false
            }
            testit = false
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Classes - Array Store Multiple'),
            h('p', { class: o } as any, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification - should have 'red bold' classes
    await page.waitForTimeout(50)
    let className = await paragraph.evaluate(el => el.className)
    await expect(className).toContain('red')
    await expect(className).toContain('bold')

    // Step 1: manually trigger toggle function
    await page.evaluate(() => {
        const o = window.testClassesArrayStoreMultiple
        const toggle = () => {
            if (o[0]) {
                o[0] = false
                o[1] = 'blue'
            } else {
                o[0] = 'red bold'
                o[1] = false
            }
        }
        toggle()
    })
    await page.waitForTimeout(50)
    className = await paragraph.evaluate(el => el.className)
    await expect(className).toContain('blue')
    await expect(className).not.toContain('red')
    await expect(className).not.toContain('bold')

    // Step 2: manually trigger toggle function again
    await page.evaluate(() => {
        const o = window.testClassesArrayStoreMultiple
        const toggle = () => {
            if (o[0]) {
                o[0] = false
                o[1] = 'blue'
            } else {
                o[0] = 'red bold'
                o[1] = false
            }
        }
        toggle()
    })
    await page.waitForTimeout(50)
    className = await paragraph.evaluate(el => el.className)
    await expect(className).toContain('red')
    await expect(className).toContain('bold')
    await expect(className).not.toContain('blue')
})
