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

test('Template External component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render, template } = woby

        // Component logic extracted from source file
        // Static content - direct rendering without intervals
        // [Implementation based on source file: TestTemplateExternal.tsx]

        // Create templated component
        const Templated = template<{ class: string, color: string }>((props: any) => {
            return h('div', { className: props.class } as any,
                h('span', null, 'outer ',
                    h('span', { 'data-color': props.color } as any, 'inner')
                )
            )
        })

        // Create the component element using h() function - static content
        const element = h('div', null,
            h('h3', null, 'Template - External'),
            h(Templated, { class: 'red', color: 'blue' }),
            h(Templated, { class: 'blue', color: 'red' })
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification
    const container = page.locator('div').first()  // Get the first (main) container div

    // Wait for rendering to complete
    await page.waitForTimeout(100)
    const innerHTML = await container.evaluate(el => el.innerHTML)  // Get innerHTML to see all elements
    await expect(innerHTML).toBe('<h3>Template - External</h3><div class="red"><span>outer <span data-color="blue">inner</span></span></div><div class="blue"><span>outer <span data-color="red">inner</span></span></div>')  // Expected output from source
})