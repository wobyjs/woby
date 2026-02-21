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
        testClassesObjectStoreMultiple: import('woby').Observable<{ 'red bold': boolean; blue: boolean }>
    }
}

test('Classes - Object Store Multiple component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, store } = woby

        // Create the component logic based on source
        const o = store({ 'red bold': true, blue: false })
        window.testClassesObjectStoreMultiple = o  // Make observable accessible globally
        let testit = true
        const toggle = () => {
            if (o['red bold']) {
                o['red bold'] = false
                o.blue = true
            } else {
                o['red bold'] = true
                o.blue = false
            }
            testit = false
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Classes - Object Store Multiple'),
            h('p', { class: o } as any, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step 1: Verify initial state - should have 'red bold' classes
    const paragraph = page.locator('p')
    let currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toContain('red')
    await expect(currentClass).toContain('bold')

    // Step 2: Manually trigger toggle function
    await page.evaluate(() => {
        const o = window.testClassesObjectStoreMultiple
        let testit = true
        const toggle = () => {
            if (o['red bold']) {
                o['red bold'] = false
                o.blue = true
            } else {
                o['red bold'] = true
                o.blue = false
            }
            testit = false
        }
        toggle()
    })
    await page.waitForTimeout(50)
    currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toBe('blue')
    await expect(currentClass).not.toContain('red')
    await expect(currentClass).not.toContain('bold')

    // Step 3: Manually trigger toggle function again
    await page.evaluate(() => {
        const o = window.testClassesObjectStoreMultiple
        let testit = true
        const toggle = () => {
            if (o['red bold']) {
                o['red bold'] = false
                o.blue = true
            } else {
                o['red bold'] = true
                o.blue = false
            }
            testit = false
        }
        toggle()
    })
    await page.waitForTimeout(50)
    currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toContain('red')
    await expect(currentClass).toContain('bold')
    await expect(currentClass).not.toContain('blue')

    // Step 4: Verify toggle cycle works
    await page.evaluate(() => {
        const o = window.testClassesObjectStoreMultiple
        let testit = true
        const toggle = () => {
            if (o['red bold']) {
                o['red bold'] = false
                o.blue = true
            } else {
                o['red bold'] = true
                o.blue = false
            }
            testit = false
        }
        toggle()
    })
    await page.waitForTimeout(50)
    currentClass = await paragraph.evaluate(el => el.className)
    await expect(currentClass).toBe('blue')
    await expect(currentClass).not.toContain('red')
    await expect(currentClass).not.toContain('bold')
})
