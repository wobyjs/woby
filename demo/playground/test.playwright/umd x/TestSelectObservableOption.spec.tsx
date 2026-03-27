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
        testSelectObservableOption: import('woby').Observable<boolean>
    }
}

test('Select - Observable Option component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestSelectObservableOption.tsx
        const element = h(TestSelectObservableOption, null)

        function TestSelectObservableOption() {
            const branch = $(true)
            window.testSelectObservableOption = branch  // Store observable for testing
            return [
                h('h3', null, 'Select - Observable Option'),
                h('select', { name: 'select-observable-option' },
                    h('option', { value: 'foo', selected: false }, 'foo'),
                    h('option', { value: 'bar', selected: branch }, 'bar'),
                    h('option', { value: 'baz', selected: false }, 'baz'),
                    h('option', { value: 'qux', selected: () => !branch() }, 'qux')
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
    await expect(heading).toHaveText('Select - Observable Option')
    await expect(select).toHaveAttribute('name', 'select-observable-option')

    // Check that the 'bar' option is selected (since branch starts as true)
    await expect(select).toHaveValue('bar')

    // Verify the exact HTML structure
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    expect(bodyHTML).toContain('<select name="select-observable-option">')
    expect(bodyHTML).toContain('<option value="bar">')

    // Verify the observable value
    const observableValue = await page.evaluate(() => window.testSelectObservableOption())
    await expect(observableValue).toBe(true)
})

