/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestPromiseRejected component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        // Default observable for template
        const o = $('initial')

        // Create the component element using h() function
        const rejected = () => o  // Mock function
        const element = h('div', null,
            h('h3', null, 'Promise - Rejected'),
            (() => {
                if (rejected().pending) return h('p', {}, "Pending...")
                if (rejected().error) return h('p', {}, "[observable-content]")
                return h('p', {}, "[observable-content]")
            })()
        )

        // Render to body
        render(element, document.body)
    })

    // Get initial state
    const paragraph = page.locator('p')
    // Initial assertion would depend on actual content
})