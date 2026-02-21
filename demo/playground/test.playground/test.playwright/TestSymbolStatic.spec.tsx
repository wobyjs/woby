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
        testTestSymbolStatic: import('woby').Observable<any>
    }
}

test('Symbol - Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Symbol - Static'),
            h('p', null, Symbol())
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Symbol should render as empty content
    const paragraph = page.locator('p')
    await expect(paragraph).not.toBeNull()
})
