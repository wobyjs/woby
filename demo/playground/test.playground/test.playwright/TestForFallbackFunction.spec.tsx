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
        // No observable exposed to window in this test
    }
}

test('For - Fallback Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, For } = woby

        // Component logic extracted from source file
        // For content with fallback function - empty array triggers fallback
        // [Implementation based on source file: TestForFallbackFunction.tsx]

        // Create the component element using h() function - For with fallback
        const Fallback = () => {
            const o = $('0.5') // Use fixed value instead of random
            return h('p', null, 'Fallback: ', o)
        }

        const element = h('div', null,
            h('h3', null, 'For - Fallback Function'),
            For({
                values: [],
                fallback: Fallback,
                children: (value: number) => h('p', null, 'Value: ', value)
            })
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Check that fallback content is rendered
    await page.waitForTimeout(50)
    const container = page.locator('div')

    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<div><h3>For - <p>Fallback: 0.5</p></div>')
})

