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

test('Directive - Ref component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, useEffect, createDirective } = woby

        // Implement component logic based on TestDirectiveRef.tsx
        const model = (element, arg1) => {
            useEffect(() => {
                const value = `${arg1}`
                element.value = value
                element.setAttribute('value', value)
            }, { sync: true })
        }
        const Model = createDirective('model', model)
        
        const element = h(TestDirectiveRef, null)

        function TestDirectiveRef() {
            return [
                h('h3', null, 'Directive - Ref'),
                h('input', { ref: Model.ref('bar'), value: 'foo' })
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const inputElement = page.locator('input')

    // Initial state verification
    await page.waitForTimeout(50)
    const inputValue = await inputElement.evaluate(el => el.value)
    
    await expect(inputValue).toBe('bar')
})

