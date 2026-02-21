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
        testAttributeFunction: import("woby").Observable<string>
    }
}

test('Attribute - Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $('red')
        window.testAttributeFunction = o  // Make observable accessible globally
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')

        // Create the component element using h() function with function attribute
        const element = h('div', null,
            h('h3', null, 'Attribute - Function'),
            h('p', { 'data-color': () => `dark${o()}` } as any, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should have data-color="darkred"
    await page.waitForTimeout(50)
    let attribute = await paragraph.getAttribute('data-color')
    await expect(attribute).toBe('darkred')

    // Step 1: red -> blue
    await page.evaluate(() => {
        const o = window.testAttributeFunction
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
        toggle()
    })
    await page.waitForTimeout(50)
    attribute = await paragraph.getAttribute('data-color')
    await expect(attribute).toBe('darkblue')

    // Step 2: blue -> red
    await page.evaluate(() => {
        const o = window.testAttributeFunction
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
        toggle()
    })
    await page.waitForTimeout(50)
    attribute = await paragraph.getAttribute('data-color')
    await expect(attribute).toBe('darkred')
})
