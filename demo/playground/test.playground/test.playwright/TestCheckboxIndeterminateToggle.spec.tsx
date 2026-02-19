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

test('Checkbox Indeterminate Toggle component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Observable for indeterminate state
        const o = $(false)

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Checkbox - Indeterminate Toggle'),
            h('input', { type: 'checkbox', indeterminate: o } as any),
            h('input', { type: 'checkbox', checked: true, indeterminate: o } as any)
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification
    const container = page.locator('div').first()

    // Verify the complete element structure (indeterminate is a DOM property, not rendered as HTML attribute)
    await page.waitForTimeout(100)
    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<h3>Checkbox - Indeterminate Toggle</h3><input type="checkbox"><input type="checkbox">')
})
