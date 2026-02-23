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
        testTestForRandom: import('woby').Observable<number[]>
    }
}

test('For - Random Only Child component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, For } = woby

        // Component logic extracted from source file
        // For content with random values - uses observable array with random numbers
        // [Implementation based on source file: TestForRandom.tsx]

        // Define random function inline (mocks util.random())
        const random = (): number => {
            const value = Math.random()
            if (value === 0 || value === 1) return random()
            return value
        }

        // Create the component element using h() function - For with random values
        const values = $([random(), random(), random()])
        window.testTestForRandom = values  // Make values accessible globally

        const element = h('div', null,
            h('h3', null, 'For - Random Only Child'),
            For({
                values: values,
                children: (value: number) => h('p', null, 'Value: ', value)
            })
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Check that all values are rendered
    await page.waitForTimeout(50)
    const container = page.locator('body')

    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<div><h3>For - Random Only Child</h3><p>Value: 0.1</p><p>Value: 0.2</p><p>Value: 0.3</p></div>')
})

