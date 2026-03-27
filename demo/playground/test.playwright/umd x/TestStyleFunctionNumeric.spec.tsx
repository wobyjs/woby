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

test('Style - Function Numeric component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, h, render } = woby

        // Implement component logic based on TestStyleFunctionNumeric.tsx
        const o = $({ flexGrow: 1, width: 50 })
        window.testTestStyleFunctionNumeric = o
        const toggle = () => o(prev => (prev.flexGrow === 1) ? { flexGrow: 2, width: 100 } : { flexGrow: 1, width: 50 })

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Style - Function Numeric'),
            h('p', { style: () => $$(o) }, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestStyleFunctionNumeric.tsx
    const style = await paragraph.evaluate(el => el.style.cssText)
    await expect(style).toContain('flex-grow: 1')
    await expect(style).toContain('width: 50px')
    await expect(innerHTML).toBe('content')
})

