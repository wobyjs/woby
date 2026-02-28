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
    }
}

test('Fragment - Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Fragment } = woby

        // Component logic extracted from source file
        // Fragment content - uses shorthand Fragment syntax
        // [Implementation based on source file: TestFragmentStatic.tsx]

        // Create the component element using h() function - Fragment shorthand
        const element = h(Fragment, {},
            h('h3', null, 'Fragment - Static'),
            h('p', null, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Check that content is rendered correctly
    await page.waitForTimeout(50)
    const container = page.locator('body')

    const innerHTML = await container.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<h3>Fragment - Static</h3><p>content</p>')
})
