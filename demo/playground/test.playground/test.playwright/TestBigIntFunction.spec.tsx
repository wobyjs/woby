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

test('Big Int Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render } = woby

        // Component logic extracted from source file
        // Static content - direct rendering without intervals
        // Source has <p>{() => o()}</p> where o is a BigInt observable
        // Expected output: <p>value</p> with the BigInt value
        const o = woby.$(123n)  // Initial BigInt value from source

        // Create the component element using h() function - static content
        const element = h('div', null,
            h('h3', null, 'BigInt - Function'),
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
    await expect(outerHTML).toBe('<p>123n</p>')  // Expected output - BigInt renders with 'n' suffix
})
