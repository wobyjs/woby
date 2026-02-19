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

test('Directive Single Argument component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render, createDirective, useEffect } = woby

        // Component logic extracted from source file
        // Static content - direct rendering without intervals
        // [Implementation based on source file: TestDirectiveSingleArgument.tsx]

        // Create directive
        const model: any = (element: any, arg1: any) => {
            const value = `${arg1}`
            element.value = value
            element.setAttribute('value', value)
        }
        const Model: any = (createDirective as any)('model', model)

        // Create the component element using h() function - static content
        const element = h('div', null,
            h('h3', null, 'Directive - Single Argument'),
            h(Model.Provider, null,
                h('input', { value: 'foo', 'use:model': 'bar' } as any)
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification
    const container = page.locator('div').first()  // Get the main container div

    // Verify the complete element structure
    await page.waitForTimeout(100)
    const innerHTML = await container.evaluate(el => el.innerHTML)  // Get innerHTML to see all elements
    // This assertion should be updated based on actual expected output from source
    await expect(innerHTML).toBe('<h3>Directive - Single Argument</h3><input value="bar">')  // Expected output from source
})