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
        testTestForUnkeyedFallbackObservable: import('woby').Observable<string>
    }
}

test('For - Unkeyed - Fallback Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, For } = woby

        // Component logic extracted from source file
        // For content with unkeyed fallback observable - empty array triggers fallback with unkeyed flag
        // [Implementation based on source file: TestForUnkeyedFallbackObservable.tsx]

        // Create the component element using h() function - For with unkeyed fallback observable
        const o = $('0.8') // Fixed value for static test
        window.testTestForUnkeyedFallbackObservable = o  // Make observable accessible globally

        const Fallback = () => {
            return h('p', null, 'Fallback: ', o)
        }

        const element = h('div', null,
            h('h3', null, 'For - Unkeyed - Fallback Observable'),
            For({
                values: [],
                fallback: h(Fallback, {}),
                unkeyed: true,
                children: (value: import('woby').ObservableReadonly<number>) => h('p', null, 'Value: ', value)
            } as any)
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Check that fallback content is rendered
    await page.waitForTimeout(50)

    // Get the value from window where we stored it
    const value = await page.evaluate(() => window.testTestForUnkeyedFallbackObservable())

    // Verify value exists
    await expect(value).toBeDefined()

    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    // Check that h3 title is present
    await expect(bodyHTML).toContain('<h3>For - Unkeyed - Fallback Observable</h3>')
    // Check that fallback value is rendered
    await expect(bodyHTML).toContain(`<p>Fallback: ${value}</p>`)
})

