/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('TestNestedIfs component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { h, render } = woby

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Nested Ifs'),
            h('p', null, 'nestedifs')
        )
        
        render(element, document.body)
    })

    // Verify component renders
    const element = page.locator('h3:has-text("Nested Ifs")')
    await expect(element).toBeVisible()
})