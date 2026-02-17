/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestNestedArrays component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const items = $("[0, 1, 2]")
        const activeItem = $(1)
        const itemsState = $("$(testObservables['TestNestedArrays']")

        // Create the component element using h() function
        const For = (props) => {
            return props.values().map(props.children)
        } // Mock For component
        const If = (props) => props.when() ? h('div', null, props.children) : null // Mock If component
        const incrementItems = () => { } // Mock function

        const element = h('div', null,
            h('h3', null, 'Nested Arrays'),
            h('button', { 'onClick': incrementItems }, "Increment"),
            h('ul', null,
                h(For, { values: items },
                    (item) => {
                        return h('div', null,  // Wrapper for Fragment-like behavior
                            h(If, { when: () => activeItem() === item },
                                h('li', {}, "test")
                            ),
                            h('li', {}, "[observable-content]")
                        )
                    }
                )
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Get initial state
    const paragraph = page.locator('p')
    // Initial assertion would depend on actual content
})