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
        testTestDynamicHeading: import('woby').Observable<any>
    }
}

test('Dynamic - Heading component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Dynamic } = woby

        // Component logic extracted from source file
        // Dynamic content - uses manual increment to cycle through heading levels
        // [Implementation based on source file: TestDynamicHeading.tsx]

        const level = $(1)
        window.testTestDynamicHeading = level  // Make observable accessible globally
        const increment = () => {
            const nextLevel = (level() + 1) % 7 || 1
            level(nextLevel)
        }

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('h3', null, 'Dynamic - Heading'),
            () => {
                const headings = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' }
                const tag = headings[level()]
                return h(Dynamic, { component: tag } as any,
                    'Level: ', level
                )
            }
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const dynamicElement = page.locator('h1, h2, h3, h4, h5, h6')

    // Initial state: should be h1 (level 1)
    await page.waitForTimeout(50)
    let tagName = await dynamicElement.evaluate(el => el.tagName.toLowerCase())
    await expect(tagName).toBe('h1')
    let textContent = await dynamicElement.evaluate(el => el.textContent)
    await expect(textContent).toBe('Level: 1')

    // Step 1: increment level -> 2 (h2)
    await page.evaluate(() => {
        const level = window.testTestDynamicHeading
        const increment = () => {
            const nextLevel = (level() + 1) % 7 || 1
            level(nextLevel)
        }
        increment()
    })
    await page.waitForTimeout(50)
    tagName = await dynamicElement.evaluate(el => el.tagName.toLowerCase())
    await expect(tagName).toBe('h2')
    textContent = await dynamicElement.evaluate(el => el.textContent)
    await expect(textContent).toBe('Level: 2')

    // Step 2: increment level -> 3 (h3)
    await page.evaluate(() => {
        const level = window.testTestDynamicHeading
        const increment = () => {
            const nextLevel = (level() + 1) % 7 || 1
            level(nextLevel)
        }
        increment()
    })
    await page.waitForTimeout(50)
    tagName = await dynamicElement.evaluate(el => el.tagName.toLowerCase())
    await expect(tagName).toBe('h3')
    textContent = await dynamicElement.evaluate(el => el.textContent)
    await expect(textContent).toBe('Level: 3')
})

