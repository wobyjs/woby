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

test('For - Unkeyed - Function Observables component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, For } = woby

        // Component logic extracted from source file
        // For content with unkeyed function observables - function returns array of observables with unkeyed flag
        // [Implementation based on source file: TestForUnkeyedFunctionObservables.tsx]

        // Create the component element using h() function - For with unkeyed function observables
        const v1 = $(1)
        const v2 = $(2)
        const v3 = $(3)
        const values = [v1, v2, v3]

        const element = h('div', null,
            h('h3', null, 'For - Unkeyed - Function Observables'),
            h(For, {
                values: () => values,
                unkeyed: true,
                children: (value: import('woby').ObservableReadonly<number>) => h('p', null, 'Value: ', value)
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
    await expect(innerHTML).toBe('<h3>For - Unkeyed - Function Observables</h3><p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>')
})
