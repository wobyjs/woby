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

test('Big Int Removal component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Static content - direct rendering without intervals
        // [Implementation based on source file: TestBigIntRemoval.tsx]

        // Create observable with initial value null (for removal test)
        const o = $<bigint | null>(null)

        // Create the component element using h() function - static content
        const element = h('div', null,
            h('h3', null, 'BigInt - Removal'),
            h('p', null, '(', o, ')')  // Pass observable in parentheses
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification
    const container = page.locator('div').first()  // Get the main container div

    // Verify the complete element structure
    await page.waitForTimeout(100)
    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<h3>BigInt - Removal</h3><p>(<!---->)</p>')  // Expected when value is null (removal)
})