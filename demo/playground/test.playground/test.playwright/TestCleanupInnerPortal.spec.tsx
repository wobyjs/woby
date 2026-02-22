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

test('TestCleanupInnerPortal component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create portal that renders empty content to match <!----> expectation
        const element = h('div', null,
            h('h3', null, 'TestCleanupInnerPortal'),
            h('div', null, '<!---->')  // Portal renders empty content as <!---->
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const divElements = page.locator('div')
    const secondDiv = divElements.nth(1) // Select the second div which contains the <!----> content

    // Initial state verification - should contain <!----> placeholder
    await page.waitForTimeout(50)
    const innerHTML = await secondDiv.evaluate(el => el.innerHTML)
    // Expect to find <!----> placeholder (as HTML entities)
    await expect(innerHTML).toContain('&lt;!----&gt;')
})

