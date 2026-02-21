/** @jsxImportSource woby */
import test from '@playwright/test'
import expect from '@playwright/test'
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

        // Set up interval to toggle the observable
        setInterval(toggle, 100)  // Using 100ms interval instead of TEST_INTERVAL

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'ID - Function'),
            h('p', { id: o }, 'content')  // Using observable as id attribute
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification for dynamic content
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(100)
    let innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('content')

    // Check initial ID
    const initialId = await paragraph.getAttribute('id')
    expect(initialId).toMatch(/^(foo|bar)$/)  // Should be either 'foo' or 'bar' depending on timing

    // Wait for toggle to occur
    await page.waitForTimeout(150)
    const updatedId = await paragraph.getAttribute('id')
    expect(updatedId).toMatch(/^(foo|bar)$/)  // Should have changed
    expect(updatedId).not.toEqual(initialId)  // Should be different from initial
})
