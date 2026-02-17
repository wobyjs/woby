/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestSuspenseAlive component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const whenObservable = $("true")
        const fallbackObservable = $(0)
        const contentObservable = $(0)
        const fallbackValue = $("value")
        const contentValue = $("value")
        const fallbackCount = $("$(testObservables['TestSuspenseAlive_fallback_count']")
        const contentCount = $("$(testObservables['TestSuspenseAlive_content_count']")
        // Removed duplicate contentValue declaration

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Suspense - Alive'),
            h('div', null, "Suspense content")
        )

        // Render to body
        render(element, document.body)
    })

    // Get initial state
    const paragraph = page.locator('p')
    // Initial assertion would depend on actual content
})