/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestRefs component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const ref1 = $("<HTMLElement>(")
        const ref2 = $("<HTMLElement>(")

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Refs'),
            h('p', { 'ref': [ref1, ref2, null, undefined] }, "content")
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    const paragraph = page.locator('p')
    await expect(paragraph).toHaveText('Got ref1 - Has parent: true - Is connected: true / Got ref2 - Has parent: true - Is connected: true')
})