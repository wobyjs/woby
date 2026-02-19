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
        testObservableClassFunctionString: import('woby').Observable<any>
    }
}

test('Class Function String component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Dynamic content - with intervals or observables
        // Source has class changing between 'red' and 'blue'
        const o = woby.$('red')  // Initial value from source
        window.testObservableClassFunctionString = o  // Make observable accessible globally
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Class - Function String'),
            h('p', { 'class': () => o() } as any, 'content')  // Function class from source
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification for dynamic content
    const paragraph = page.locator('p')

    // Initial state: should be 'red'
    await page.waitForTimeout(50)
    let outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p class="red">content</p>')  // Initial value from source

    // Step 1: red -> blue
    await page.evaluate(() => {
        const o = window.testObservableClassFunctionString
        o(prev => (prev === 'red') ? 'blue' : 'red')
    })
    await page.waitForTimeout(50)
    outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p class="blue">content</p>')  // Toggled value

    // Step 2: blue -> red
    await page.evaluate(() => {
        const o = window.testObservableClassFunctionString
        o(prev => (prev === 'red') ? 'blue' : 'red')
    })
    await page.waitForTimeout(50)
    outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p class="red">content</p>')  // Back to initial
})
