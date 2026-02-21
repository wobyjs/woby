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
        testTestForUnkeyedFallbackObservableStatic: import('woby').Observable<undefined>
    }
}

test('For - Unkeyed - Fallback Observable Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, For } = woby

        // Component logic extracted from source file
        // For content with unkeyed fallback observable static - empty array triggers static fallback with unkeyed flag
        // [Implementation based on source file: TestForUnkeyedFallbackObservableStatic.tsx]

        // Create the component element using h() function - For with unkeyed fallback observable static
        const Fallback = () => {
            return h('p', null, 'Fallback: 0.123456')
        }

        const element = h('div', null,
            h('h3', null, 'For - Unkeyed - Fallback Observable Static'),
            h(For, {
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
    // Check that static fallback content is rendered
    await page.waitForTimeout(50)
    const container = page.locator('body')

    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<h3>For - Unkeyed - Fallback Observable Static</h3><p>Fallback: 0.123456</p>')
})
