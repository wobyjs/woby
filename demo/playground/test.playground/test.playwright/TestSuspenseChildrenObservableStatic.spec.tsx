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
        testTestSuspenseChildrenObservableStatic: import('woby').Observable<string>
    }
}

test('Suspense - Children Observable Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestSuspenseChildrenObservableStatic.tsx
        const initialValue = String(Math.random())
        window.testTestSuspenseChildrenObservableStatic = $(initialValue)
        
        const Children = () => {
            return h('p', null, 'Children: ', initialValue)
        }
        
        const Fallback = () => {
            return h('p', null, 'Fallback!')
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Suspense - Children Observable Static'),
            h('woby-suspense', { fallback: Fallback }, Children)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestSuspenseChildrenObservableStatic.tsx
    await expect(innerHTML).toContain('Children: ')
})

