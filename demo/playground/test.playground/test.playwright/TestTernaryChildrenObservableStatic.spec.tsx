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
        testTernaryChildrenObservableStatic_true: import('woby').Observable<string>
        testTernaryChildrenObservableStatic_false: import('woby').Observable<string>
    }
}

test('Ternary - Children Observable Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, h, render, Ternary } = woby

        // Component logic extracted from source file
        // Dynamic content - uses useInterval to cycle through random values
        // [Implementation based on source file: TestTernaryChildrenObservableStatic.tsx]

        const random = () => Math.random()
        const trueValue = $(String(random()))
        const falseValue = $(String(random()))
        window.testTernaryChildrenObservableStatic_true = trueValue  // Make observable accessible globally
        window.testTernaryChildrenObservableStatic_false = falseValue  // Make observable accessible globally

        const True = () => {
            const o = $(String(random()))
            const randomize = () => o(String(random()))
            useInterval(randomize, 100)  // TEST_INTERVAL
            o()
            return h('p', null, 'True: ', () => $$(trueValue))
        }

        const False = () => {
            const o = $(String(random()))
            const randomize = () => o(String(random()))
            useInterval(randomize, 100)  // TEST_INTERVAL
            o()
            return h('p', null, 'False: ', () => $$(falseValue))
        }

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('h3', null, 'Ternary - Children Observable Static'),
            h(Ternary, { when: true } as any, h(True, {}), h(False, {})),
            h(Ternary, { when: false } as any, h(True, {}), h(False, {}))
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraphs = page.locator('p')
    await page.waitForTimeout(50)

    // Initial state: should have 2 paragraphs
    await expect(paragraphs).toHaveCount(2)
    await expect(paragraphs.first()).toHaveText(/True: \d+\.\d+/)
    await expect(paragraphs.nth(1)).toHaveText(/False: \d+\.\d+/)

    // Step 1: manually trigger trueValue randomize function
    await page.evaluate(() => {
        const trueValue = window.testTernaryChildrenObservableStatic_true
        const random = () => Math.random()
        const randomize = () => trueValue(String(random()))
        randomize()
    })
    await page.waitForTimeout(50)
    const firstText = await paragraphs.first().textContent()
    await expect(firstText).toMatch(/True: \d+\.\d+/)

    // Step 2: manually trigger falseValue randomize function
    await page.evaluate(() => {
        const falseValue = window.testTernaryChildrenObservableStatic_false
        const random = () => Math.random()
        const randomize = () => falseValue(String(random()))
        randomize()
    })
    await page.waitForTimeout(50)
    const secondText = await paragraphs.nth(1).textContent()
    await expect(secondText).toMatch(/False: \d+\.\d+/)
})
