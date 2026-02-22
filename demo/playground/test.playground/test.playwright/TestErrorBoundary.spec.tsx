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

test('Error Boundary component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, ErrorBoundary } = woby

        // Implement component logic based on TestErrorBoundary.tsx
        const Erroring = () => {
            // Immediately throw error for predictable test
            throw new Error('Custom error')
        }

        const Fallback = ({ error }) => {
            if (!error) return h('p', null, 'No error')
            return h('p', null, 'Error caught: ', String(error.message || error))
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Error Boundary'),
            h(ErrorBoundary, { fallback: Fallback }, h(Erroring))
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestErrorBoundary.tsx
    await expect(innerHTML).toBe('Error caught: Custom error')
})

