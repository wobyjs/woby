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
        testTestForUnkeyedFallbackFunction: import('woby').Observable<string>
    }
}

test('For - Unkeyed - Fallback Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, For } = woby

        // Component logic extracted from source file
        // For content with unkeyed fallback function - empty array triggers fallback with unkeyed flag
        // [Implementation based on source file: TestForUnkeyedFallbackFunction.tsx]

        // Create the component element using h() function - For with unkeyed fallback function
        const o = $('0.7') // Fixed value for static test
        window.testTestForUnkeyedFallbackFunction = o  // Make observable accessible globally
        o()

        const Fallback = () => {
            return h('p', null, 'Fallback: ', o)
        }

        const element = h('div', null,
            h('h3', null, 'For - Unkeyed - Fallback Function'),
            For({
                values: [],
                fallback: Fallback,
                unkeyed: true,
                children: (value: import('woby').ObservableReadonly<number>) => h('p', null, 'Value: ', value)
            })
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Check that fallback content is rendered
    await page.waitForTimeout(50)
    const container = page.locator('body')

    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<div><h3>For - <p>Fallback: 0.7</p></div>')
})

