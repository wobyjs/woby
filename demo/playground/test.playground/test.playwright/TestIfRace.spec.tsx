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

test('If - Race component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, If } = woby

        // Create the component element using h() function
        const data = { deep: 'hi' }  // Static data for static test
        const visible = true  // Static value for static test

        const element = h('div', null,
            h('h3', null, 'If - Race'),
            h(If, { when: visible } as any,
                h('div', null, data?.deep || '')
            )
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // The content should be 'hi' inside a div
    const div = page.locator('div').nth(1)
    await expect(div).toHaveText('hi')
})
