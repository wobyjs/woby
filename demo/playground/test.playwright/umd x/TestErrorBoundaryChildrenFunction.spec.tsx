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
        testTestErrorBoundaryChildrenFunction: import('woby').Observable<string>
    }
}

test('Error Boundary - Children Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, ErrorBoundary } = woby

        // Implement component logic based on TestErrorBoundaryChildrenFunction.tsx
        const element = h(TestErrorBoundaryChildrenFunction, null)

        function TestErrorBoundaryChildrenFunction() {
            const childrenValue = 'test-value'
            window.testTestErrorBoundaryChildrenFunction = $(childrenValue)  // Make observable accessible globally
            const Children = () => h('p', null, 'Children: ', childrenValue)
            const Fallback = () => h('p', null, 'Fallback!')
            return [
                h('h3', null, 'Error Boundary - Children Function'),
                h(ErrorBoundary, { fallback: h(Fallback, null) },
                    h(Children, null)
                )
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const textContent = await paragraph.evaluate(el => el.textContent)
    // Add proper expectations based on TestErrorBoundaryChildrenFunction.tsx
    await expect(textContent).toContain('Children: ')
})

