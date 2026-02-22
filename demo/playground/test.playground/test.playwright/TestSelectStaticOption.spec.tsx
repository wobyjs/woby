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

test('Select - Static Option component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestSelectStaticOption.tsx
        const element = h(TestSelectStaticOption, null)

        function TestSelectStaticOption() {
            return [
                h('h3', null, 'Select - Static Option'),
                h('select', { name: 'select-static-option' },
                    h('option', { value: 'foo', selected: false }, 'foo'),
                    h('option', { value: 'bar', selected: true }, 'bar'),
                    h('option', { value: 'baz', selected: false }, 'baz'),
                    h('option', { value: 'qux', selected: false }, 'qux')
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
