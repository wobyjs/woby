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
        testTestEventClickCaptureStatic: import('woby').Observable<number>
    }
}

test('Event - Click Capture Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, $$ } = woby

        // Component logic extracted from source file
        // Event click capture static - button increments on click capture
        // [Implementation based on source file: TestEventClickCaptureStatic.tsx]
        
        const o = $(0)
        const ref = $<HTMLButtonElement>()
        const testTestEventClickCaptureStatic = o
        window.testTestEventClickCaptureStatic = testTestEventClickCaptureStatic
        const increment = () => o(prev => prev + 1)
        
        const TestEventClickCaptureStatic = () => {
            return [
                h('h3', null, 'Event - Click Capture Static'),
                h('p', null, h('button', { ref: ref, onClickCapture: increment }, o))
            ]
        }

        const element = h(TestEventClickCaptureStatic, null)

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const heading = page.locator('h3')
    const paragraph = page.locator('p')
    const button = page.locator('button')

    // Initial state verification
    await page.waitForTimeout(50)
    await expect(heading).toHaveText('Event - Click Capture Static')
    const buttonText = await button.evaluate(el => el.textContent)
    await expect(buttonText).toBe('0')
    
    // Fire click event externally
    await page.evaluate(() => {
        const button = document.querySelector('button')
        if (button) {
            button.click()
        }
    })
    
    // Wait for update and verify
    await page.waitForTimeout(10)
    const observableValue = await page.evaluate(() => window.testTestEventClickCaptureStatic())
    const buttonText2 = await button.evaluate(el => el.textContent)
    await expect(buttonText2).toBe(`${observableValue}`)
})

