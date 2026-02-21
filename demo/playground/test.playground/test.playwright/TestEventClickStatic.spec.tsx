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
        testTestEventClickStatic: import('woby').Observable<any>
    }
}

test('Event - Click Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Dynamic content - with intervals or observables
        // [Implementation based on source file: TestEventClickStatic.tsx]

        const o = $(0)
        const ref = $(null)
        window.testTestEventClickStatic = o  // Expose observable for testing

        const increment = () => o(prev => prev + 1)

        // Set up interval to programmatically click the button
        setInterval(() => {
            const button = ref()
            if (button) {
                button.click()
            }
        }, 100)  // Using 100ms interval instead of TEST_INTERVAL

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Event - Click Static'),
            h('p', null,
                h('button', {
                    ref,
                    onClick: increment
                } as any, o)
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification for dynamic content
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(100)
    let innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<button>0</button>')

    // Wait for increment to occur
    await page.waitForTimeout(150)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // The button should have been clicked, so value should be incremented
    // Since the interval keeps running, the value might be 1 or higher
    expect(innerHTML).toMatch(/<button>[1-9]\d*<\/button>/)
})
