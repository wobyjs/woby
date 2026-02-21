/** @jsxImportSource woby */
import test from '@playwright/test'
import expect from '@playwright/test'
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
        testTestStyleObservableVariable: import('woby').Observable<string>
    }
}

test('Style - Observable Variable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestStyleObservableVariable.tsx
        const o = $('green')
        window.testTestStyleObservableVariable = o
        const toggle = () => o(prev => (prev === 'orange') ? 'green' : 'orange')

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Style - Observable Variable'),
            h('p', { style: { color: 'var(--color)', '--color': $$(o) } }, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestStyleObservableVariable.tsx
    const style = await paragraph.evaluate(el => el.style.cssText)
    await expect(style).toContain('color: var(--color)')
    await expect(style).toContain('--color: green')
    await expect(innerHTML).toBe('content')
})

