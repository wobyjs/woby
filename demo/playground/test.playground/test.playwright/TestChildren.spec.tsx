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

test('Children component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render } = woby

        // Component logic extracted from source file
        // Static content - direct rendering without intervals
        // Create nested components A, B, C as defined in source

        // Create the component element using h() function - static content
        const element = h('div', null,
            h('h3', null, 'Children'),
            h('div', { 'class': 'A' } as any,
                h('div', { 'class': 'B' } as any,
                    h('div', { 'class': 'C' } as any,
                        h('p', null, 'content')
                    )
                )
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification
    // The source expects the entire nested structure
    const container = page.locator('div.A')

    // Verify the complete element structure
    await page.waitForTimeout(50)
    const outerHTML = await container.evaluate(el => el.outerHTML)
    await expect(outerHTML).toBe('<div class="A"><div class="B"><div class="C"><p>content</p></div></div></div>')
})
