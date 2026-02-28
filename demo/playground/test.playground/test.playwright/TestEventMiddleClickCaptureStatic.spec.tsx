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
        testTestEventMiddleClickCaptureStatic: import('woby').Observable<number>
    }
}

test('Event - Middle Click Capture Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, h, render } = woby

        // Implement component logic based on TestEventMiddleClickCaptureStatic.tsx
        const o = $(0)
        const ref = $()
        window.testTestEventMiddleClickCaptureStatic_o = o

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Event - Middle Click Capture Static'),
            h('p', null, h('button', { ref: ref }, () => $$(o)))
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestEventMiddleClickCaptureStatic.tsx
    const button = await paragraph.locator('button').first()
    const buttonText = await button.evaluate(el => el.textContent)
    await expect(buttonText).toBe('0')
})

