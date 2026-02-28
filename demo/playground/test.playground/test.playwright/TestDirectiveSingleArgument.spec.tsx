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

test('Directive - Single Argument component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, useEffect, createDirective } = woby

        // Implement component logic based on TestDirectiveSingleArgument.tsx
        const model = (element, arg1) => {
            useEffect(() => {
                const value = `${arg1}`
                element.value = value
                element.setAttribute('value', value)
            }, { sync: true })
        }
        const Model = createDirective('model', model)
        
        const element = h(TestDirectiveSingleArgument, null)

        function TestDirectiveSingleArgument() {
            return [
                h('h3', null, 'Directive - Single Argument'),
                h('input', { value: 'foo', ref: Model.ref('bar') })
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Wait for rendering
    await page.waitForTimeout(50)
    
    // Get the input element
    const input = page.locator('input')
    
    // Verify the input has the expected value
    await expect(input).toHaveValue('bar')
})

