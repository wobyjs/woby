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
        testTestStringFunction: import('woby').Observable<string>
    }
}

test('String - Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Define random function locally since it's not available in the woby module
        const random = () => Math.random()

        const TestStringFunction = () => {
            const o = $(String(random()))
            const testTestStringFunction = o
            window.testTestStringFunction = testTestStringFunction
            const randomize = () => o(String(random()))

            return [
                h('h3', null, 'String - Function'),
                h('p', null, () => o())
            ]
        }

        const element = h(TestStringFunction, null)

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const heading = page.locator('h3')
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    await expect(heading).toHaveText('String - Function')

    // Check initial value is a random string
    const initialValue = await paragraph.evaluate(el => el.innerHTML)
    await expect(initialValue).toMatch(/^\d+\.\d+$/)

    // Get the observable value from window
    const observableValue = await page.evaluate(() => window.testTestStringFunction())
    await expect(initialValue).toBe(observableValue)

    // Step 1: Randomize the value
    await page.evaluate(() => {
        const o = window.testTestStringFunction
        const randomize = () => o(String(Math.random()))
        randomize()
    })
    await page.waitForTimeout(50)
    const newValue = await paragraph.evaluate(el => el.innerHTML)
    await expect(newValue).toMatch(/^\d+\.\d+$/)
    await expect(newValue).not.toBe(initialValue)
})

