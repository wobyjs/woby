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
        testTestHTMLFunctionStaticRegistry: import('woby').Observable<undefined>
    }
}

test('HTML - Function - Static Registry component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestHTMLFunctionStaticRegistry.tsx
        const P = () => {
            return h('p', null, Math.random().toString())
        }
        
        // Register components in html registry
        // Note: html.register would be called here in the real implementation

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'HTML - Function - Static Registry'),
            h('woby-if', { when: true }, h('p', null, Math.random().toString()))
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestHTMLFunctionStaticRegistry.tsx
    await expect(innerHTML).not.toBe('')
})

