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
    }
}

test('For - Unkeyed - Random Only Child component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, For } = woby

        // Component logic extracted from source file
        // For content with unkeyed random only child - array of fixed numbers with unkeyed flag
        // [Implementation based on source file: TestForUnkeyedRandomOnlyChild.tsx]

        // Create the component element using h() function - For with unkeyed random only child
        const values = [0.123456, 0.789012, 0.345678]  // Fixed values for static test

        const element = h('div', null,
            h('h3', null, 'For - Unkeyed - Random Only Child'),
            h(For, {
                values: values,
                unkeyed: true,
                children: (value: import('woby').ObservableReadonly<number>) => h('p', null, value)
            } as any)
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Check that all values are rendered
    await page.waitForTimeout(50)
    const container = page.locator('body')

    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<h3>For - Unkeyed - Random Only Child</h3><p>0.123456</p><p>0.789012</p><p>0.345678</p>')
})
