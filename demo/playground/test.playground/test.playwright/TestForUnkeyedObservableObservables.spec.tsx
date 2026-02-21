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
        testTestForUnkeyedObservableObservables: import('woby').Observable<undefined>
    }
}

test('For - Unkeyed - Observable Observables component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, For } = woby

        // Component logic extracted from source file
        // For content with unkeyed observable observables - array of observables with unkeyed flag
        // [Implementation based on source file: TestForUnkeyedObservableObservables.tsx]

        // Create the component element using h() function - For with unkeyed observable observables
        const v1 = $(1)
        const v2 = $(2)
        const v3 = $(3)
        const v4 = $(4)
        const v5 = $(5)
        const values = [v1, v2, v3, v4, v5]

        const element = h('div', null,
            h('h3', null, 'For - Unkeyed - Observable Observables'),
            h(For, {
                values: values,
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
    await expect(innerHTML).toBe('<h3>For - Unkeyed - Observable Observables</h3><p>Value: 1</p><p>Value: 2</p><p>Value: 3</p><p>Value: 4</p><p>Value: 5</p>')
})
