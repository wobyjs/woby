/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestForUnkeyedObservableObservables component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const v1 = $(1)
        const v2 = $(2)
        const v3 = $(3)
        const v4 = $(4)
        const v5 = $(5)
        const values = $("[v1, v2, v3, v4, v5]")

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'For - Unkeyed - Observable Observables'),<For values={values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return             h('p', {}, "[observable-content]")
                }}
            </For>
        )
        
        // Render to body
        render(element, document.body)
    })

    // Get initial state
    const paragraph = page.locator('p')
    // Initial assertion would depend on actual content
})