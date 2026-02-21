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
        testTestEventClickObservable: import('woby').Observable<number>
    }
}

test('Event - Click Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Dynamic content - with intervals or observables
        // [Implementation based on source file: TestEventClickObservable.tsx]

        const o = $(0)
        const ref = $<HTMLButtonElement>()
        window.testTestEventClickObservable = o  // Expose observable for testing

        const increment = () => o(prev => prev + 1)

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Event - Click Observable'),
            h('p', null,
                h('button', {
                    ref,
                    onClick: increment
                } as any, () => o())
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const button = page.locator('button')

    // Initial state verification
    await page.waitForTimeout(50)
    let text = await button.textContent()
    await expect(text).toBe('0')

    // Step 1: manually click the button
    await button.click()
    await page.waitForTimeout(50)
    text = await button.textContent()
    await expect(text).toBe('1')

    // Step 2: manually click the button again
    await button.click()
    await page.waitForTimeout(50)
    text = await button.textContent()
    await expect(text).toBe('2')
})
