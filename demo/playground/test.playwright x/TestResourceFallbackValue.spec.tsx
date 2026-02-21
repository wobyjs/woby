/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestResourceFallbackValue component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        // Default observable for template
        const o = $('initial')

        // Create the component element using h() function
        const ErrorBoundary = (props) => h('div', null, props.children)  // Mock ErrorBoundary
        const If = (props) => props.when ? h('div', null, props.children) : h('div', null, props.fallback)
        const resource = { value: o }  // Mock resource object
        const element = h('div', null,
            h('h3', null, 'Resource - Fallback Value'),
            h(ErrorBoundary, { fallback: h('p', {}, "Error!") },
                h(If, {
                    when: () => resource.value(),
                    fallback: h('p', {}, "Loading!")
                },
                    h('p', {}, "Loaded!")
                )),
            h(ErrorBoundary, { fallback: h('p', {}, "Error!") },
                h(If, {
                    when: resource.value,
                    fallback: h('p', {}, "Loading!")
                },
                    h('p', {}, "Loaded!")
                ))
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    const paragraph = page.locator('p')
    await expect(paragraph).toHaveText('Error!')
})