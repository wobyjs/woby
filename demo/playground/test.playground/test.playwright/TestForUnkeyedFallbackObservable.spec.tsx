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

test('For Unkeyed Fallback Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, For } = woby

        // Component logic extracted from source file
        // Dynamic content - with intervals or observables
        // [Implementation based on source file: TestForUnkeyedFallbackObservable.tsx]

        // Create observable for the fallback content
        const o = $(String(Math.floor(Math.random() * 100))) // Using random number like source

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'For - Unkeyed - Fallback Observable'),
            h(For, { values: [], fallback: h('p', null, 'Fallback: ', o), unkeyed: true } as any)
        )

        // Render to body
        render(element, document.body)
    })

    // Verification for dynamic content
    const container = page.locator('div')  // Get the container div

    // Wait for rendering to complete
    await page.waitForTimeout(100)
    const innerHTML = await container.evaluate(el => el.innerHTML)  // Get innerHTML to see all elements
    // Check that fallback content is shown since values array is empty
    expect(innerHTML).toContain('Fallback:')  // Should contain fallback content
})