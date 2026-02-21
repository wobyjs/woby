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
        testIfFallbackObservable: import('woby').Observable<string>
    }
}

test('If - Fallback Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, If } = woby

        // Component logic extracted from source file
        // Dynamic content - uses useInterval to cycle through random values
        // [Implementation based on source file: TestIfFallbackObservable.tsx]

        const random = () => Math.random()
        const o = $(String(random()))
        window.testIfFallbackObservable = o  // Make observable accessible globally
        const randomize = () => o(String(random()))

        const Fallback = () => {
            return h('p', null, `Fallback: ${o()}`)
        }

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('h3', null, 'If - Fallback Observable'),
            h(If, { when: false, fallback: Fallback() } as any, 'Children')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should show fallback with random value
    await page.waitForTimeout(50)
    let text = await paragraph.textContent()
    await expect(text).toMatch(/Fallback: \d+\.\d+/)

    // Step 1: manually trigger randomize function
    await page.evaluate(() => {
        const o = window.testIfFallbackObservable
        const random = () => Math.random()
        const randomize = () => o(String(random()))
        randomize()
    })
    await page.waitForTimeout(50)
    text = await paragraph.textContent()
    await expect(text).toMatch(/Fallback: \d+\.\d+/)

    // Step 2: manually trigger randomize function again
    await page.evaluate(() => {
        const o = window.testIfFallbackObservable
        const random = () => Math.random()
        const randomize = () => o(String(random()))
        randomize()
    })
    await page.waitForTimeout(50)
    text = await paragraph.textContent()
    await expect(text).toMatch(/Fallback: \d+\.\d+/)
})
