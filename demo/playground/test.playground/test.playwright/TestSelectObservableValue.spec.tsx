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
        testTestSelectObservableValue: import('woby').Observable<string>
    }
}

test('Select - Observable Value component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestSelectObservableValue.tsx
        const element = h(TestSelectObservableValue, null)

        function TestSelectObservableValue() {
            const value = $('bar')
            // Note: For static test, we don't use interval
            return [
                h('h3', null, 'Select - Observable Value'),
                h('select', { name: 'select-observable-value', value: value },
                    h('option', { value: 'foo' }, 'foo'),
                    h('option', { value: 'bar' }, 'bar'),
                    h('option', { value: 'baz' }, 'baz'),
                    h('option', { value: 'qux' }, 'qux')
                )
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const select = page.locator('select')

    // Initial state verification
    await page.waitForTimeout(50)
    const selectValue = await select.evaluate(el => (el as HTMLSelectElement).value)
    await expect(selectValue).toBe('bar')
})

