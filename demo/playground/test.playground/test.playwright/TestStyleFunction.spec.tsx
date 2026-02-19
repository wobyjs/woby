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
        testObservableStyleFunction: import('woby').Observable<any>
    }
}

test('Style Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Dynamic content - with intervals or observables
        // Source has style changing between green and orange
        const o = woby.$('green')  // Initial value from source
        window.testObservableStyleFunction = o  // Make observable accessible globally
        const toggle = () => o(prev => (prev === 'green') ? 'orange' : 'green')

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Style - Function'),
            h('p', { 'style': { color: () => o() } } as any, 'content')  // Function style from source
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification for dynamic content
    const paragraph = page.locator('p')

    // Initial state: should be green
    await page.waitForTimeout(50)
    let outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p style="color: green;">content</p>')  // Initial value from source

    // Step 1: green -> orange
    await page.evaluate(() => {
        const o = window.testObservableStyleFunction
        o(prev => (prev === 'green') ? 'orange' : 'green')
    })
    await page.waitForTimeout(50)
    outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p style="color: orange;">content</p>')  // Toggled value

    // Step 2: orange -> green
    await page.evaluate(() => {
        const o = window.testObservableStyleFunction
        o(prev => (prev === 'green') ? 'orange' : 'green')
    })
    await page.waitForTimeout(50)
    outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p style="color: green;">content</p>')  // Back to initial
})
