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

    // Get the actual values from window where we stored them
    const values = await page.evaluate(() => window.testTestForRandom ? window.testTestForRandom() : undefined)

    // Verify values exist and are displayed correctly
    await expect(values).toBeDefined()
    await expect(values.length).toBe(3)

    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    // Check that h3 title is present
    await expect(bodyHTML).toContain('<h3>For - Random Only Child</h3>')
    // Check that all three values are rendered
    await expect(bodyHTML).toContain(`<p>Value: ${values[0]}</p>`)
    await expect(bodyHTML).toContain(`<p>Value: ${values[1]}</p>`)
    await expect(bodyHTML).toContain(`<p>Value: ${values[2]}</p>`)
})

