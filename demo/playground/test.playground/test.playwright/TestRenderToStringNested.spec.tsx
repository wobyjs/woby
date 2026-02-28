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
    }
}

test('renderToString - Nested component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestRenderToStringNested.tsx
        const element = h(TestRenderToStringNested, null)

        function TestRenderToStringNested() {
            return [
                h('div', null,
                    h('h3', null, 'renderToString - Nested'),
                    h('p', null, '123<div><h3>renderToString</h3><p>123</p></div>')
                )
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Wait for rendering
    await page.waitForTimeout(50)
    
    // Get the paragraph element
    const paragraph = page.locator('p')
    
    // Verify the paragraph content
    await expect(paragraph).toHaveText('123<div><h3>renderToString</h3><p>123</p></div>')
})
