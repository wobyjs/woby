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

    }
}

test('String - Observable Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestStringObservableStatic.tsx
        const element = h(TestStringObservableStatic, null)

        function TestStringObservableStatic() {
            const initialValue = "0.123456"
            return [
                h('h3', null, 'String - Observable Static'),
                h('p', null, initialValue)
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const heading = page.locator('h3')
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    await expect(heading).toHaveText('String - Observable Static')
    await expect(paragraph).toHaveText('0.123456')

    // Verify the exact HTML structure
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    const expectedHTML = '<h3>String - Observable Static</h3><p>0.123456</p>'
    await expect(bodyHTML).toBe(expectedHTML)


})
