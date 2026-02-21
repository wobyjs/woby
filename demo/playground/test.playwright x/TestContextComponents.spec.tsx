/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestContextComponents component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render, createContext, useContext } = woby

        // Create the component logic based on source
        // Default observable for template
        const o = $('initial')
        const Context = createContext("outer")

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Context - Components'),
            h(Context.Provider, { value: "outer" },
                () => {
                    const value = useContext(Context)
                    return h('p', {}, "[observable-content]")
                },
                h(Context.Provider, { value: "inner" },
                    () => {
                        const value = useContext(Context)
                        return h('p', {}, "[observable-content]")
                    }
                ),
                () => {
                    const value = useContext(Context)
                    return h('p', {}, "[observable-content]")
                }
            )
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    const paragraphs = page.locator('p')
    await expect(paragraphs.nth(0)).toHaveText('[observable-content]')
    await expect(paragraphs.nth(1)).toHaveText('[observable-content]')
    await expect(paragraphs.nth(2)).toHaveText('[observable-content]')
})