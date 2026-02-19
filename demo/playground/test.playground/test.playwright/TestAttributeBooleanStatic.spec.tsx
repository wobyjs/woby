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

test('Attribute Boolean Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render } = woby

        // Component logic extracted from source file
        // Static content - direct rendering without intervals
        // Source has two paragraphs with boolean disabled attributes: true and false
        // Expected output: <p disabled="">content</p><p>content</p>

        // Create the component element using h() function - static content
        const element = h('div', null,
            h('h3', null, 'Attribute Boolan - Static'),
            h('p', { 'disabled': true } as any, 'content'),  // disabled={true} -> disabled=""
            h('p', { 'disabled': false } as any, 'content')  // disabled={false} -> no attribute
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification
    // The source expects both paragraphs in sequence
    const container = page.locator('div')  // Get the container div

    // Verify the complete element structure
    await page.waitForTimeout(50)
    const outerHTML = await container.evaluate(el => el.innerHTML)  // Get innerHTML to see both paragraphs
    await expect(outerHTML).toBe('<h3>Attribute Boolan - Static</h3><p disabled="">content</p><p>content</p>')  // Expected output from source
})
