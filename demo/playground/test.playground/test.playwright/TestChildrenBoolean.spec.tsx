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

test('Children Boolean component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render } = woby

        // Custom component that renders Number(children) in a <p>
        const Custom = (props: any) => {
            return h('p', null, Number(props.children))
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Children - Boolean'),
            h(Custom, { children: true }),
            h(Custom, { children: false })
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification
    const container = page.locator('div').first()

    // Verify the complete element structure
    await page.waitForTimeout(100)
    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<h3>Children - Boolean</h3><p>1</p><p>0</p>')
})
