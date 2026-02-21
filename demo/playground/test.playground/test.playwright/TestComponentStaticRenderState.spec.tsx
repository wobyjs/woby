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
        testTestComponentStaticRenderState: import('woby').Observable<undefined>
    }
}

test('Component - Static Render State component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestComponentStaticRenderState.tsx
        const TestComponentStaticRenderState = ({ value = 0 }: { value?: number }) => {
            const multiplier = 0
            return h('div', null,
                h('h3', null, 'Component - Static Render State'),
                h('p', null, (value || 0) * multiplier)
            )
        }

        // Create the component element using h() function
        const element = h(TestComponentStaticRenderState, { value: 5 })

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Component multiplies value by 0, so result should always be 0
    await expect(innerHTML).toBe('0')
})

