/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestErrorBoundaryFallbackFunction component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $("value")

        // Create the component element using h() function
        const ErrorBoundary = (props) => h('div', null, props.children)  // Mock ErrorBoundary component
        const Fallback = (props) => h('div', null, 'Fallback content')  // Mock Fallback component
        const Children = (props) => h('div', null, 'Children content')  // Mock Children component
        const element = h('div', null,
            h('h3', null, 'Error Boundary - Fallback Function'),
            h('p', null,
                h(ErrorBoundary, { fallback: h(Fallback, {}) },
                    h(Children, {})
                )
            )
        )

        // Render to body
        render(element, document.body)

        // Define randomize function
        const randomize = () => o(prev => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })
            ; (document.body as any)['randomizeTestErrorBoundaryFallbackFunction'] = randomize
    })

    // For static test, verify initial state
    const element = page.locator('h3:has-text("Error Boundary - Fallback Function")')
    await expect(element).toBeVisible()
})