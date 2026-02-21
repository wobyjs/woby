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
        testTestErrorBoundaryChildrenObservableStatic: import('woby').Observable<string>
    }
}

test('Error Boundary - Children Observable Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestErrorBoundaryChildrenObservableStatic.tsx
        const childrenValue = String(Math.random())
        const childrenObservable = $(childrenValue)
        window.testTestErrorBoundaryChildrenObservableStatic = childrenObservable
        
        const Children = () => {
            return h('p', null, 'Children: ', childrenValue)
        }
        
        const Fallback = () => {
            return h('p', null, 'Fallback!')
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Error Boundary - Children Observable Static'),
            h('woby-error-boundary', { fallback: Fallback }, Children)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestErrorBoundaryChildrenObservableStatic.tsx
    await expect(innerHTML).toContain('Children: ')
})

