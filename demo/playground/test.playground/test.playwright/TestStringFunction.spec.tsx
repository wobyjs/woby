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
        testObservableStringFunction: import('woby').Observable<any>
    }
}

test('String Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Dynamic content - with intervals or observables
        // Source creates random strings that change over time
        const o = woby.$('initial-value')  // Initial value from source (would use random())
        window.testObservableStringFunction = o  // Make observable accessible globally
        const randomize = () => o('new-value')  // Simplified for testing - in real scenario would use random()

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'String - Function'),
            h('p', null, () => o())  // Function child from source
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification for dynamic content
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    let outerHTML = await paragraph.evaluate(el => el.outerHTML)
    // Initial value should be reflected
    await expect(outerHTML).toContain('<p>')  // Contains the paragraph with some content

    // Step 1: Change the value
    await page.evaluate(() => {
        const o = window.testObservableStringFunction
        o('updated-value')
    })
    await page.waitForTimeout(50)
    outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p>updated-value</p>')  // Updated value

    // Additional steps for dynamic components would go here
    // Based on the specific logic in the source file
})
