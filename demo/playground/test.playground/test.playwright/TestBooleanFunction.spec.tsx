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

test('Boolean Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render } = woby

        // Component logic extracted from source file
        // Component logic extracted from source file
        const o = woby.$(true)  // Initial value from source

        // Although source has useInterval, test config has static: true
        // Source has <p>{() => o()}</p> which may render as placeholders

        // Create the component element using h() function - static content
        const element = h('div', null,
            h('h3', null, 'Boolean - Function'),
            h('p', null, () => o())  // Function child from source
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification
    const paragraph = page.locator('p')

    // Verify the complete element structure
    await page.waitForTimeout(50)
    const outerHTML = await paragraph.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<p><!----></p>')  // Expected output from source test config
})
