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
        testSimpleExpect: any
    }
}

test('Simple Expect Test component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Simple static component with Hello World text
        // [Implementation based on source file: TestSimpleExpect.tsx]
        
        const value = $("Hello World")
        window.testSimpleExpect = value  // Store observable for testing
        
        const TestSimpleExpect = () => {
            return [
                h('h3', null, 'Simple Expect Test'),
                h('p', null, value)
            ]
        }

        const element = h(TestSimpleExpect, null)

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const heading = page.locator('h3')
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    await expect(heading).toHaveText('Simple Expect Test')
    await expect(paragraph).toHaveText('Hello World')
    
    // Verify the exact HTML structure
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    const expectedHTML = '<h3>Simple Expect Test</h3><p>Hello World</p>'
    await expect(bodyHTML).toBe(expectedHTML)
    
    // Verify the observable value
    const observableValue = await page.evaluate(() => window.testSimpleExpect())
    await expect(observableValue).toBe('Hello World')
})

