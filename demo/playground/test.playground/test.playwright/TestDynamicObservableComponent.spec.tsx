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
        testTestDynamicObservableComponent: import('woby').Observable<number>
    }
}

test('Dynamic - Observable Component component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestDynamicObservableComponent.tsx
        const level = $(1)
        window.testTestDynamicObservableComponent = level
        const component = useMemo(() => `h${level()}`)
        const increment = () => {
            level((level() + 1) % 7 || 1)
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Dynamic - Observable Component'),
            h('woby-dynamic', { component: component }, 'Level: ', () => $$(level))
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestDynamicObservableComponent.tsx
    await expect(innerHTML).toContain('Level: ')
})

