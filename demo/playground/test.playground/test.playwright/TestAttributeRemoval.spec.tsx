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
        testTestAttributeRemoval: import('woby').Observable<string | null>
    }
}

test('Attribute - Removal component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Dynamic content - uses observable for attribute that can be removed
        // [Implementation based on source file: TestAttributeRemoval.tsx]

        const o = $<string | null>(null)
        window.testTestAttributeRemoval = o  // Make observable accessible globally

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('h3', null, 'Attribute - Removal'),
            h('p', { 'data-color': o } as any, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should have no data-color attribute (since o() is null)
    await page.waitForTimeout(50)
    let hasAttribute = await paragraph.evaluate(el => el.hasAttribute('data-color'))
    await expect(hasAttribute).toBe(false)

    // Step 1: change o to 'red' -> data-color should appear
    await page.evaluate(() => {
        const o = window.testTestAttributeRemoval
        o('red')
    })
    await page.waitForTimeout(50)
    let attribute = await paragraph.getAttribute('data-color')
    await expect(attribute).toBe('red')

    // Step 2: change o back to null -> data-color should disappear
    await page.evaluate(() => {
        const o = window.testTestAttributeRemoval
        o(null)
    })
    await page.waitForTimeout(50)
    hasAttribute = await paragraph.evaluate(el => el.hasAttribute('data-color'))
    await expect(hasAttribute).toBe(false)
})
