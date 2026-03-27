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

// Augment window type for test observables
declare global {
    interface Window {
        // No observable exposed to window in this test
    }
}

test('Number - Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render } = woby

        // Component logic extracted from source file
        // Static content - direct rendering without intervals
        // [Implementation based on source file: TestNumberStatic.tsx]

        // Create the component element using h() function - static content
        const element = h('div', null,
            h('h3', null, 'Number - Static'),
            h('p', null, 123)
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification
    const container = page.locator('div')  // Get the container div

    // Wait for rendering to complete
    await page.waitForTimeout(100)
    const innerHTML = await container.evaluate(el => el.innerHTML)  // Get innerHTML to see all elements
    await expect(innerHTML).toBe('<h3>Number - Static</h3><p>123</p>')  // Expected output from source
})
