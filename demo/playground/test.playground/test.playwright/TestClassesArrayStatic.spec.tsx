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

test('Classes Array Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render } = woby

        // Component logic extracted from source file
        // Static content - direct rendering without intervals
        // Source has class array with conditional classes: ['red', false && 'blue', null && 'blue', undefined && 'blue']
        // Only 'red' should be applied since others are falsy

        // Create the component element using h() function - static content
        const element = h('div', null,
            h('h3', null, 'Classes - Array Static'),
            h('p', { 'class': ['red', false && 'blue', null && 'blue', undefined && 'blue'] } as any, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification
    const paragraph = page.locator('p')

    // Verify the complete element structure
    await page.waitForTimeout(50)
    const outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p class="red">content</p>')  // Expected output from source test config
})
