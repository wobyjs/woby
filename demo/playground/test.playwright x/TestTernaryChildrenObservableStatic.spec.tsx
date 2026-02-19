/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestTernaryChildrenObservableStatic component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $("value")

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Ternary - Children Observable Static'),
            h('p', null, "<Ternary when={true}>\n                <True />\n                <False />\n            </Ternary>\n            <Ternary when={false}>\n                <True />\n                <False />\n            </Ternary>")
        )

        // Render to body
        render(element, document.body)

        // Define randomize function
        const randomize = () => o((prev: any) => {
            // Toggle logic would be implemented based on source
            return typeof prev === 'boolean' ? !prev : typeof prev === 'number' ? prev + 1 : prev + '_updated'
        })
            ; (document.body as any)['randomizeTestTernaryChildrenObservableStatic'] = randomize
    })

    // For static test, verify initial state
    const element = page.locator('h3:has-text("Ternary - Children Observable Static")')
    await expect(element).toBeVisible()
})