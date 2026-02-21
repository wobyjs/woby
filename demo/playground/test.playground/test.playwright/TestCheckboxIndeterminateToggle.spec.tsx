/** @jsxImportSource woby */
import test from '@playwright/test'
import expect from '@playwright/test'
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
        testCheckboxIndeterminateToggle: import("woby").Observable<boolean>
    }
}

test('Checkbox - Indeterminate Toggle component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $<boolean>(false)
        window.testCheckboxIndeterminateToggle = o  // Make observable accessible globally
        const toggle = () => o(prev => !prev)

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Checkbox - Indeterminate Toggle'),
            h('input', { type: 'checkbox', indeterminate: o }),
            h('input', { type: 'checkbox', checked: true, indeterminate: o })
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const checkboxes = page.locator('input[type="checkbox"]')

    // Initial state: should be false
    await page.waitForTimeout(50)
    let count = await checkboxes.count()
    await expect(count).toBe(2)

    // Check initial indeterminate state
    let indeterminate1 = await checkboxes.nth(0).evaluate(el => (el as HTMLInputElement).indeterminate)
    let indeterminate2 = await checkboxes.nth(1).evaluate(el => (el as HTMLInputElement).indeterminate)
    await expect(indeterminate1).toBe(false)
    await expect(indeterminate2).toBe(false)

    // Step 1: false -> true
    await page.evaluate(() => {
        const o = window.testCheckboxIndeterminateToggle
        const toggle = () => o(prev => !prev)
        toggle()
    })
    await page.waitForTimeout(50)
    indeterminate1 = await checkboxes.nth(0).evaluate(el => (el as HTMLInputElement).indeterminate)
    indeterminate2 = await checkboxes.nth(1).evaluate(el => (el as HTMLInputElement).indeterminate)
    await expect(indeterminate1).toBe(true)
    await expect(indeterminate2).toBe(true)

    // Step 2: true -> false
    await page.evaluate(() => {
        const o = window.testCheckboxIndeterminateToggle
        const toggle = () => o(prev => !prev)
        toggle()
    })
    await page.waitForTimeout(50)
    indeterminate1 = await checkboxes.nth(0).evaluate(el => (el as HTMLInputElement).indeterminate)
    indeterminate2 = await checkboxes.nth(1).evaluate(el => (el as HTMLInputElement).indeterminate)
    await expect(indeterminate1).toBe(false)
    await expect(indeterminate2).toBe(false)
})
