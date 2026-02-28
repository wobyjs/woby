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
        testTestForRandomOnlyChild: import('woby').Observable<number[]>
    }
}

test('For - Random component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, For } = woby

        // Component logic extracted from source file
        // For content with random values only child - uses observable array with random numbers
        // [Implementation based on source file: TestForRandomOnlyChild.tsx]

        // Create the component element using h() function - For with random values only child
        const values = $([0.4, 0.5, 0.6]) // Fixed values for static test
        window.testTestForRandomOnlyChild = values  // Make values accessible globally

        const element = h('div', null,
            h('h3', null, 'For - Random'),
            For({
                values: values,
                children: (value: number) => h('p', null, value)
            })
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Check that all values are rendered
    await page.waitForTimeout(50)

    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    // Check that h3 title is present
    await expect(bodyHTML).toContain('<h3>For - Random</h3>')
    // Check that all three values are rendered
    await expect(bodyHTML).toContain('<p>0.4</p>')
    await expect(bodyHTML).toContain('<p>0.5</p>')
    await expect(bodyHTML).toContain('<p>0.6</p>')
})

