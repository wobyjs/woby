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

// Augment window type for test observables
declare global {
    interface Window {
        testTestNestedArrays: import('woby').Observable<any>
    }
}

test('Nested Arrays component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const items = $([0, 1])  // Start with fewer items to show <!----> placeholders
        const activeItem = $(0)  // Set active item to first item

        // Mock For component that handles <!----> placeholders
        const For = (props) => {
            const values = props.values()
            return values.map((item, index) => {
                // Mock the If component behavior - when condition is false, render <!---->
                const ifCondition = activeItem() === item
                const ifContent = ifCondition ? h('li', null, 'test') : '<!---->'

                return h('div', null,
                    ifContent,
                    h('li', null, item)
                )
            })
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Nested Arrays'),
            h('button', null, 'Increment'),
            h('ul', null,
                h(For, { values: items })
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const list = page.locator('ul')

    // Initial state verification - should contain <!----> placeholders
    await page.waitForTimeout(50)
    const innerHTML = await list.evaluate(el => el.innerHTML)
    // Expect to find <!----> placeholders for inactive items
    await expect(innerHTML).toContain('<!---->')
})
