/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestSelectObservableValue component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const ref = $("<HTMLSelectElement>(")
        const value = $('bar')

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Select - Observable Value'),            h('select', {'ref': {ref}, 'name': 'select-observable-value', 'value': {value}}, "<option value="foo">foo</option>
                <option value="bar">bar</option>
                <option value="baz">baz</option>
                <option value="qux">qux</option>")
        )
        
        // Render to body
        render(element, document.body)
        
        // Define toggle function
        const toggle = () => value(prev => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })
        ;(document.body as any)['toggleTestSelectObservableValue'] = toggle
    })

    // For static test, verify initial state
    const element = page.locator('h3:has-text("Select - Observable Value")')
    await expect(element).toBeVisible()
})