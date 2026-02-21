/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestTernaryStaticInline component', async ({ page }) => {
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
            h('h3', null, 'Ternary - Static Inline'),
            h('Ternary', { when: true },
                h('p', {}, "true (1)"),
                h('p', {}, "false (1)")
            ),
            h('Ternary', { when: false },
                h('p', {}, "true (2)"),
                h('p', {}, "false (2)")
            )
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    const paragraph = page.locator('p')
    await expect(paragraph).toHaveText('true (1)')
})