/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestInputForm component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        // Default observable for template
        const o = $('initial')

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Input - Input Form'),
            h('input', { 'form': undefined }),
            h('input', { 'form': null }),
            h('input', { 'form': 'foo' })
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    const element = page.locator('h3:has-text("Input - Input Form")')
    await expect(element).toBeVisible()
})