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



test('Switch - Case Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Switch } = woby

        // Create the component element using h() function
        const Case = () => {
            return h('p', null, 'Case: 0.123456')
        }

        const element = h('div', null,
            h('h3', null, 'Switch - Case Function'),
            h(Switch, { when: 0 } as any,
                h(Switch.Case, { when: 0 } as any, Case),
                h(Switch.Default, {} as any, h('p', null, 'default'))
            )
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Since when=0 matches the first case, the content should be 'Case: 0.123456'
    const paragraph = page.locator('p')
    await expect(paragraph).toHaveText('Case: 0.123456')
})
