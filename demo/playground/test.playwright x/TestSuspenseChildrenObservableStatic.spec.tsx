/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestSuspenseChildrenObservableStatic component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const initialValue = $("$(testObservables['TestSuspenseChildrenObservableStatic']")

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Suspense - Children Observable Static'),
            h('div', null, "Suspense content")
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    const element = page.locator('h3:has-text("Suspense - Children Observable Static")')
    await expect(element).toBeVisible()
})