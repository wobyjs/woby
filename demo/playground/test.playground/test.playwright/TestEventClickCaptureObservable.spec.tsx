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
        testEventClickCaptureObservable: any
    }
}

test('Event - Click Capture Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, $$ } = woby

        // Component logic extracted from source file
        // Event click capture with observable - button increments on click capture
        // [Implementation based on source file: TestEventClickCaptureObservable.tsx]
        
        const o = $(0)
        const ref = $<HTMLButtonElement>()
        window.testEventClickCaptureObservable = o  // Make observable accessible globally
        const increment = () => o(prev => prev + 1)
        
        const TestEventClickCaptureObservable = () => {
            return [
                h('h3', null, 'Event - Click Capture Observable'),
                h('p', null, 
                    h('button', { ref: ref, onClickCapture: increment }, o)
                )
            ]
        }

        const element = h(TestEventClickCaptureObservable, null)

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const heading = page.locator('h3')
    const paragraph = page.locator('p')
    const button = page.locator('button')

    // Initial state verification
    await page.waitForTimeout(50)
    await expect(heading).toHaveText('Event - Click Capture Observable')
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
    await page.waitForTimeout(50)
    const observableValue = await page.evaluate(() => window.testEventClickCaptureObservable())
    const buttonText1 = await button.evaluate(el => el.textContent)
    await expect(buttonText1).toBe(`${observableValue}`)
    
    // Second click to verify incrementing
    await page.evaluate(() => {
        const button = document.querySelector('button')
        if (button) {
            button.click()
        }
    })
    
    await page.waitForTimeout(50)
    const observableValue2 = await page.evaluate(() => window.testEventClickCaptureObservable())
    const buttonText2 = await button.evaluate(el => el.textContent)
    await expect(buttonText2).toBe(`${observableValue2}`)
    await expect(observableValue2).toBe(2)
})

