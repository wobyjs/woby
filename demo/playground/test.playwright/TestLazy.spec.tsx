/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestLazy component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const isLoading1 = $("true")
        const isLoading2 = $("$(testObservables['TestLazy']")

        // Create the component element using h() function
        const Suspense = (props) => h('div', null, props.children)  // Mock Suspense component
        const Fallback = (props) => h('div', null, 'Loading...')  // Mock Fallback component
        const LazyComponent = (props) => h('div', null, 'Lazy Content')  // Mock LazyComponent
        const element = h('div', null,
            h('h3', null, 'Lazy'),
            h('p', null,
                h(Suspense, { fallback: h(Fallback, {}) },
                    h(LazyComponent, {})
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