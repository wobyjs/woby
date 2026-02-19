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
        testObservable: import('woby').Observable<string>
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
        window.testObservable = o  // Make observable accessible globally
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Attribute - Function'),
            h('p', { 'data-color': () => `dark${o()}` } as any, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should be 'darkred'
    await page.waitForTimeout(50)
    let outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p data-color="darkred">content</p>')

    // Step 1: red -> blue
    await page.evaluate(() => {
        const o = window.testObservable
        o(prev => (prev === 'red') ? 'blue' : 'red')
    })
    await page.waitForTimeout(50)
    outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p data-color="darkblue">content</p>')

    // Step 2: blue -> red
    await page.evaluate(() => {
        const o = window.testObservable
        o(prev => (prev === 'red') ? 'blue' : 'red')
    })
    await page.waitForTimeout(50)
    outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p data-color="darkred">content</p>')
})

