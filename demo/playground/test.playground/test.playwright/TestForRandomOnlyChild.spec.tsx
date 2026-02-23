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
    const container = page.locator('body')

    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<div><h3>For - <p>0.4</p><p>0.5</p><p>0.6</p></div>')
})

