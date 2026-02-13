/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestSelectStaticValue component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const ref = $("<HTMLSelectElement>(")

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Select - Static Value'),            h('select', {'ref': {ref}, 'name': 'select-static-value', 'value': 'bar'}, "<option value="foo">foo</option>
                <option value="bar">bar</option>
                <option value="baz">baz</option>
                <option value="qux">qux</option>")
        )
        
        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    const element = page.locator('h3:has-text("Select - Static Value")')
    await expect(element).toBeVisible()
})