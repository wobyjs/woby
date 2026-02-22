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
        const { $, h, render, Dynamic, useMemo, $$ } = woby

        // Implement component logic based on TestDynamicObservableComponent.tsx
        const level = $(1)
        window.testTestDynamicObservableComponent = level
        const component = useMemo(() => `h${level()}`)
        const increment = () => {
            level((level() + 1) % 7 || 1)
        }

        // Create the component element using h() function with Dynamic component
        const element = h('div', null,
            h('h3', null, 'Dynamic - Observable Component'),
            h(Dynamic, { component: component }, 'Level: ', () => $$(level))
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const dynamicElement = page.locator('h1, h2, h3, h4, h5, h6').filter({ hasNotText: 'Dynamic - Observable Component' }).first()

    // Initial state verification
    await page.waitForTimeout(50)
    const textContent = await dynamicElement.evaluate(el => el.textContent)
    // Add proper expectations based on TestDynamicObservableComponent.tsx
    await expect(textContent).toContain('Level: ')
})

