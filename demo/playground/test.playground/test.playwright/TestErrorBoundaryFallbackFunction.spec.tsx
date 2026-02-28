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
        testTestErrorBoundaryFallbackFunction: import('woby').Observable<string>
    }
}

test('Error Boundary - Fallback Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, ErrorBoundary } = woby

        // Component logic extracted from source file
        // Error boundary with function fallback - throws error in child component
        // [Implementation based on source file: TestErrorBoundaryFallbackFunction.tsx]
        
        // Define random function inline (from util in woby)
        const random = () => Math.random()

        const TestErrorBoundaryFallbackFunction = () => {
            const Children = () => { throw new Error() }
            const fallbackValue = String(random())
            window.testTestErrorBoundaryFallbackFunction = fallbackValue  // Store the actual value

            const Fallback = () => h('p', null, 'Fallback: ', fallbackValue)

            return [
                h('h3', null, 'Error Boundary - Fallback Function'),
                h(ErrorBoundary, { fallback: Fallback },
                    h(Children)
                )
            ]
        }

        const element = h(TestErrorBoundaryFallbackFunction, null)

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const heading = page.locator('h3')
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    await expect(heading).toHaveText('Error Boundary - Fallback Function')
    
    // Get the value from window and verify
    const fallbackValue = await page.evaluate(() => window.testTestErrorBoundaryFallbackFunction)
    await expect(paragraph).toHaveText(`Fallback: ${fallbackValue}`)
})

