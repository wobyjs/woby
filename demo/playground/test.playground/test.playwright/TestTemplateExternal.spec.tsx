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



test('Template - External component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, template } = woby

        // Create the component element using h() function
        const Templated = template<{ class: string, color: string }>(props => {
            return h('div', { className: props.class },
                h('span', null, 'outer ',
                    h('span', { 'data-color': props.color }, 'inner'))
            )
        })

        const element = h('div', null,
            h('h3', null, 'Template - External'),
            Templated({ class: 'red', color: 'blue' }),
            Templated({ class: 'blue', color: 'red' })
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const divElements = page.locator('div')

    // Initial state verification
    await expect(divElements).toHaveCount(2)

    const firstDiv = page.locator('div.red')
    const secondDiv = page.locator('div.blue')

    await expect(firstDiv).toHaveAttribute('class', 'red')
    await expect(secondDiv).toHaveAttribute('class', 'blue')

    const firstSpan = firstDiv.locator('span[data-color="blue"]')
    const secondSpan = secondDiv.locator('span[data-color="red"]')

    await expect(firstSpan).toHaveText('inner')
    await expect(secondSpan).toHaveText('inner')
})

