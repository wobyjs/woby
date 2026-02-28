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

test('Directive component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, createDirective, useEffect } = woby

        // Implement component logic based on TestDirective.tsx
        const element = h(TestDirective, null)

        function TestDirective() {
            const model = (element, arg1, arg2) => {
                useEffect(() => {
                    const value = `${arg1} - ${arg2}`
                    element.value = value
                    element.setAttribute('value', value)
                }, { sync: true })
            }
            const Model = createDirective('model', model)
            return [
                h('h3', null, 'Directive'),
                h('input', { ref: Model.ref('bar', 'baz'), value: 'foo' })
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const input = page.locator('input')

    // Initial state verification
    await page.waitForTimeout(50)
    const value = await input.evaluate(el => el.value)
    // Add proper expectations based on TestDirective.tsx
    await expect(value).toBe('bar - baz')
})

