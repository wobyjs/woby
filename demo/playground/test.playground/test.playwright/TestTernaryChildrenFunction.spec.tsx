/** @jsxImportSource woby */
import test from '@playwright/test'
import expect from '@playwright/test'
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
        testTernaryChildrenFunction_true: import('woby').Observable<string>
        testTernaryChildrenFunction_false: import('woby').Observable<string>
    }
}

test('Ternary - Children Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Ternary } = woby

        // Component logic extracted from source file
        // Dynamic content - uses useTimeout to cycle through random values
        // [Implementation based on source file: TestTernaryChildrenFunction.tsx]

        const random = () => Math.random()
        const trueValue = $(String(random()))
        const falseValue = $(String(random()))
        window.testTernaryChildrenFunction_true = trueValue  // Make observable accessible globally
        window.testTernaryChildrenFunction_false = falseValue  // Make observable accessible globally

        let true1 = false
        const True = () => {
            const o = $(String(random()))
            const randomize = () => o(String(random()))
            if (!true1) {
                setTimeout(randomize, 100)  // Simulate useTimeout
                true1 = true
            }
            o()
            return h('p', null, 'True: ', trueValue)
        }

        let false1 = false
        const False = () => {
            const o = $(String(random()))
            const randomize = () => o(String(random()))
            if (!false1) {
                setTimeout(randomize, 100)  // Simulate useTimeout
                false1 = true
            }
            o()
            return h('p', null, 'False: ', falseValue)
        }

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('h3', null, 'Ternary - Children Function'),
            h(Ternary, { when: true } as any, True(), False()),
            h(Ternary, { when: false } as any, True(), False())
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
        const trueValue = window.testTernaryChildrenFunction_true
        const random = () => Math.random()
        const randomize = () => trueValue(String(random()))
        randomize()
    })
    await page.waitForTimeout(50)
    const firstText = await paragraphs.first().textContent()
    await expect(firstText).toMatch(/True: \d+\.\d+/)

    // Step 2: manually trigger falseValue randomize function
    await page.evaluate(() => {
        const falseValue = window.testTernaryChildrenFunction_false
        const random = () => Math.random()
        const randomize = () => falseValue(String(random()))
        randomize()
    })
    await page.waitForTimeout(50)
    const secondText = await paragraphs.nth(1).textContent()
    await expect(secondText).toMatch(/False: \d+\.\d+/)
})
