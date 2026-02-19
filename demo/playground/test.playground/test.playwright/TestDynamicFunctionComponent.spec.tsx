/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
// @ts-ignore
import fs from 'fs'
// @ts-ignore
import path from 'path'
// @ts-ignore
import { fileURLToPath } from 'url'
import type * as Woby from 'woby'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('Dynamic Function Component component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Dynamic content - with intervals or observables
        // [Implementation based on source file: TestDynamicFunctionComponent.tsx]

        // Create the component element using h() function
        const level: any = $(1)

        const element = h('div', null,
            h('h3', null, 'Dynamic - Function Component'),
            h('p', null, () => `h${level()}`)
        )

        // Render to body
        render(element, document.body)

            // Make level accessible globally for testing
            ; (window as any).testLevel = level
    })

    // Step-by-step verification
    const container = page.locator('div').first()

    // Initial state: should render h1
    await page.waitForTimeout(50)
    let innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toContain('<h3>Dynamic - Function Component</h3>')
    await expect(innerHTML).toContain('<p>h1</p>')

    // Step 1: increment to h2
    await page.evaluate(() => {
        const level = (window as any).testLevel
        level(2)  // Directly set to 2
    })
    await page.waitForTimeout(50)
    innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toContain('<p>h2</p>')

    // Step 2: increment to h3
    await page.evaluate(() => {
        const level = (window as any).testLevel
        level(3)  // Directly set to 3
    })
    await page.waitForTimeout(50)
    innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toContain('<p>h3</p>')
})