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
        testTestEventClickAndClickCaptureStatic: import('woby').Observable<number>
    }
}

test('Event - Click & Click Capture Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestEventClickAndClickCaptureStatic.tsx
        const o = $(0)
        window.testTestEventClickAndClickCaptureStatic = o  // Make observable accessible globally
        const ref = $<HTMLButtonElement>()
        const increment = () => o(prev => prev + 1)
        const captureIncrement = () => o(prev => prev + 1)
        
        const element = h(TestEventClickAndClickCaptureStatic, null)

        function TestEventClickAndClickCaptureStatic() {
            return [
                h('h3', null, 'Event - Click & Click Capture Static'),
                h('p', null, h('button', { ref: ref, onClick: increment, onClickCapture: captureIncrement }, o))
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const button = page.locator('button')

    // Initial state verification
    await page.waitForTimeout(50)
    const textContent = await button.evaluate(el => el.textContent)
    // Add proper expectations based on TestEventClickAndClickCaptureStatic.tsx
    await expect(textContent).toBe('0')
})

