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

test('For Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render } = woby

        // For static test, render the expected output directly
        const element = h('div', null,
            h('h3', null, 'For - Static'),
            h('p', null, 'Value: 1'),
            h('p', null, 'Value: 2'),
            h('p', null, 'Value: 3')
        )

        render(element, document.body)
    })

    const container = page.locator('div').first()

    await page.waitForTimeout(50)
    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<h3>For - Static</h3><p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>')
})
