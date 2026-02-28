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
        testTestIdFunction: import('woby').Observable<string>
    }
}

test('ID - Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Dynamic content - with intervals or observables
        // [Implementation based on source file: TestIdFunction.tsx]

        const o = $('foo')
        window.testTestIdFunction = o  // Expose observable for testing
        const toggle = () => o(prev => (prev === 'foo') ? 'bar' : 'foo')

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'ID - Function'),
            h('p', { id: () => o() }, 'content')  // Using observable function as id attribute
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification for dynamic content
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('content')

    // Check initial ID
    const initialId = await paragraph.getAttribute('id')
    expect(initialId).toBe('foo')  // Should be 'foo' initially

    // Manually trigger the toggle
    await page.evaluate(() => {
        const o = window.testTestIdFunction
        const toggle = () => o(prev => (prev === 'foo') ? 'bar' : 'foo')
        toggle()
    })
    
    await page.waitForTimeout(50)
    const updatedId = await paragraph.getAttribute('id')
    expect(updatedId).toBe('bar')  // Should be 'bar' after toggle
})
