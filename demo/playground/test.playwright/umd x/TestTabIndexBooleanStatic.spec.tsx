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

test('TabIndex - Boolean - Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render } = woby

        // Component logic extracted from source file
        // Static content - direct rendering without intervals
        // [Implementation based on source file: TestTabIndexBooleanStatic.tsx]

        // Create the component element using h() function - static content
        const element = h('div', null,
            h('h3', null, 'TabIndex - Boolean - Static'),
            h('p', { tabIndex: true } as any, 'true'),
            h('p', { tabIndex: false } as any, 'false')
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification
    const container = page.locator('div')  // Get the container div

    // Wait for rendering to complete
    await page.waitForTimeout(100)
    const innerHTML = await container.evaluate(el => el.innerHTML)  // Get innerHTML to see all elements
    await expect(innerHTML).toBe('<h3>TabIndex - Boolean - Static</h3><p tabindex="0">true</p><p>false</p>')  // Expected output from source
})
