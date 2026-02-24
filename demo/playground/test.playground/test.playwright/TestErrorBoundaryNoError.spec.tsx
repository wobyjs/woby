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
        // No observable exposed to window in this test
    }
}

test('Error Boundary - Fallback Test component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, ErrorBoundary } = woby

        // Implement component logic based on TestErrorBoundaryNoError.tsx
        const ErroringComponent = () => {
            return h('p', null, 'Normal content')
        }

        const FallbackComponent = ({ error }) => {
            // Add null check for error prop
            if (!error) return null
            return h('p', null, 'Fallback: ', error.message)
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Error Boundary - Fallback Test'),
            h(ErrorBoundary, { fallback: FallbackComponent }, h(ErroringComponent))
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestErrorBoundaryNoError.tsx
    await expect(innerHTML).toBe('Normal content')
})
