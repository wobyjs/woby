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
        testTestDynamicObservableProps: import('woby').Observable<{ class: string }>
    }
}

test('Dynamic - Observable Props component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Dynamic, $$ } = woby

        // Implement component logic based on TestDynamicObservableProps.tsx
        const red = { class: 'red' }
        const blue = { class: 'blue' }
        const props = $(red)
        window.testTestDynamicObservableProps = props
        const toggle = () => {
            props(prev => prev === red ? blue : red)
        }

        // Create the component element using h() function with Dynamic component
        const element = h('div', null,
            h('h3', null, 'Dynamic - Observable Props'),
            h(Dynamic, { component: 'h5', props: $$(props) }, 'Content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const h5 = page.locator('h5')

    // Initial state verification
    await page.waitForTimeout(50)
    const className = await h5.evaluate(el => el.className)
    await expect(className).toBe('red')
    const textContent = await h5.evaluate(el => el.textContent)
    await expect(textContent).toBe('Content')
})

