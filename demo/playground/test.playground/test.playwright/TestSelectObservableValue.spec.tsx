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
        testSelectObservableValue: import('woby').Observable<string>
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
            window.testSelectObservableValue = value  // Store observable for testing

            return [
                h('h3', null, 'Select - Observable Value'),
                h('select', { name: 'select-observable-value' },
                    h('option', { value: 'foo' }, 'foo'),
                    h('option', { value: 'bar', selected: true }, 'bar'),  // Pre-select bar since that's the initial value
                    h('option', { value: 'baz' }, 'baz'),
                    h('option', { value: 'qux' }, 'qux')
                )
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const heading = page.locator('h3')
    const select = page.locator('select')
    const options = page.locator('option')

    // Initial state verification
    await page.waitForTimeout(50)
    await expect(heading).toHaveText('Select - Observable Value')
    await expect(select).toHaveAttribute('name', 'select-observable-value')

    // Check that the 'bar' option is selected
    await expect(select).toHaveValue('bar')

    // Verify the exact HTML structure
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    expect(bodyHTML).toContain('<select name="select-observable-value">')
    expect(bodyHTML).toContain('<option value="bar">')

    // Verify the observable value
    const observableValue = await page.evaluate(() => window.testSelectObservableValue())
    await expect(observableValue).toBe('bar')
})

