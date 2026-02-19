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
        testObservableStyleObservable: import('woby').Observable<any>
    }
}

test('Style Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Dynamic content - with intervals or observables
        // Source has style observable that toggles color between green and orange
        const o = woby.$('green')  // Initial value from source
        window.testObservableStyleObservable = o  // Make observable accessible globally
        const toggle = () => o(prev => (prev === 'green') ? 'orange' : 'green')  // Toggle function from source

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Style - Observable'),
            h('p', { 'style': { color: o } } as any, 'content')  // Style with observable from source
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification for dynamic content
    const paragraph = page.locator('p')

    // Initial state: should be green
    await page.waitForTimeout(50)
    let outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p style="color: green;">content</p>')  // Initial green value

    // Step 1: Toggle to orange
    await page.evaluate(() => {
        const o = window.testObservableStyleObservable
        o('orange')
    })
    await page.waitForTimeout(50)
    outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p style="color: orange;">content</p>')  // Toggled to orange

    // Step 2: Toggle back to green
    await page.evaluate(() => {
        const o = window.testObservableStyleObservable
        o('green')
    })
    await page.waitForTimeout(50)
    outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p style="color: green;">content</p>')  // Toggled back to green
})
