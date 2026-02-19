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

test('Switch Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render } = woby

        // Switch static test - when=2, so we expect case 2 to render
        const element = h('div', null,
            h('h3', null, 'Switch - Static'),
            h('p', null, '2')
        )

        render(element, document.body)
    })

    const container = page.locator('div').first()

    await page.waitForTimeout(50)
    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<h3>Switch - Static</h3><p>2</p>')
})
