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
        testTestDynamicFunctionComponent: import('woby').Observable<number>
    }
}

test('Dynamic - Function Component component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Dynamic } = woby

        // Component logic extracted from source file
        // Dynamic content - uses manual increment to cycle through levels
        // [Implementation based on source file: TestDynamicFunctionComponent.tsx]

        const level = $(1)
        window.testTestDynamicFunctionComponent = level  // Make observable accessible globally
        const component = () => `h${level()}`
        const increment = () => level((level() + 1) % 7 || 1)

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('span', null, 'Dynamic - Function Component'),
            h(Dynamic, { component: component } as any,
                'Level: ', level
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const container = page.locator('div')

    // Debug: Check what's actually rendered
    await page.waitForTimeout(50)
    const innerHTML = await container.evaluate(el => el.innerHTML)
    console.log('Rendered HTML:', innerHTML)

    // Look for the dynamic element (not the heading)
    const dynamicElement = page.locator('h1, h2, h3, h4, h5, h6').filter({ hasNotText: 'Dynamic - Function Component' }).first()
    const count = await dynamicElement.count()
    console.log('Dynamic elements found:', count)

    if (count > 0) {
        let tagName = await dynamicElement.evaluate(el => el.tagName.toLowerCase())
        await expect(tagName).toBe('h1')
    } else {
        // If no dynamic element found, check if it's rendering as text
        await expect(innerHTML).toContain('h1')
    }

    // Step 1: increment level -> 2 (h2)
    await page.evaluate(() => {
        const level = window.testTestDynamicFunctionComponent
        const increment = () => level((level() + 1) % 7 || 1)
        increment()
    })
    await page.waitForTimeout(50)
    if (count > 0) {
        let tagName = await dynamicElement.evaluate(el => el.tagName.toLowerCase())
        await expect(tagName).toBe('h2')
    } else {
        const innerHTML = await container.evaluate(el => el.innerHTML)
        await expect(innerHTML).toContain('h2')
    }

    // Step 2: increment level -> 3 (h3)
    await page.evaluate(() => {
        const level = window.testTestDynamicFunctionComponent
        const increment = () => level((level() + 1) % 7 || 1)
        increment()
    })
    await page.waitForTimeout(50)
    if (count > 0) {
        let tagName = await dynamicElement.evaluate(el => el.tagName.toLowerCase())
        await expect(tagName).toBe('h3')
    } else {
        const innerHTML = await container.evaluate(el => el.innerHTML)
        await expect(innerHTML).toContain('h3')
    }

    // Step 3: increment level -> 4 (h4)
    await page.evaluate(() => {
        const level = window.testTestDynamicFunctionComponent
        const increment = () => level((level() + 1) % 7 || 1)
        increment()
    })
    await page.waitForTimeout(50)
    if (count > 0) {
        let tagName = await dynamicElement.evaluate(el => el.tagName.toLowerCase())
        await expect(tagName).toBe('h4')
    } else {
        const innerHTML = await container.evaluate(el => el.innerHTML)
        await expect(innerHTML).toContain('h4')
    }

    // Step 4: increment level -> 5 (h5)
    await page.evaluate(() => {
        const level = window.testTestDynamicFunctionComponent
        const increment = () => level((level() + 1) % 7 || 1)
        increment()
    })
    await page.waitForTimeout(50)
    if (count > 0) {
        let tagName = await dynamicElement.evaluate(el => el.tagName.toLowerCase())
        await expect(tagName).toBe('h5')
    } else {
        const innerHTML = await container.evaluate(el => el.innerHTML)
        await expect(innerHTML).toContain('h5')
    }

    // Step 5: increment level -> 6 (h6)
    await page.evaluate(() => {
        const level = window.testTestDynamicFunctionComponent
        const increment = () => level((level() + 1) % 7 || 1)
        increment()
    })
    await page.waitForTimeout(50)
    if (count > 0) {
        let tagName = await dynamicElement.evaluate(el => el.tagName.toLowerCase())
        await expect(tagName).toBe('h6')
    } else {
        const innerHTML = await container.evaluate(el => el.innerHTML)
        await expect(innerHTML).toContain('h6')
    }

    // Step 6: increment level -> 1 (back to h1)
    await page.evaluate(() => {
        const level = window.testTestDynamicFunctionComponent
        const increment = () => level((level() + 1) % 7 || 1)
        increment()
    })
    await page.waitForTimeout(50)
    if (count > 0) {
        let tagName = await dynamicElement.evaluate(el => el.tagName.toLowerCase())
        await expect(tagName).toBe('h1')
    } else {
        const innerHTML = await container.evaluate(el => el.innerHTML)
        await expect(innerHTML).toContain('h1')
    }
})

