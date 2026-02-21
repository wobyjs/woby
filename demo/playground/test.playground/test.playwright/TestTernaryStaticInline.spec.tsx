/** @jsxImportSource woby */
import test from '@playwright/test'
import expect from '@playwright/test'
// @ts-ignore
import fs from 'fs'
// @ts-ignore
import path from 'path'
// @ts-ignore
import { fileURLToPath } from 'url'
import type * as Woby from 'woby'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



test('Ternary - Static Inline component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Ternary } = woby

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Ternary - Static Inline'),
            h(Ternary, { when: true } as any, h('p', null, 'true (1)'), h('p', null, 'false (1)')),
            h(Ternary, { when: false } as any, h('p', null, 'true (2)'), h('p', null, 'false (2)'))
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    const paragraphs = page.locator('p')
    await expect(paragraphs).toHaveCount(2)
    await expect(paragraphs.first()).toHaveText('true (1)')
    await expect(paragraphs.nth(1)).toHaveText('false (2)')
})
