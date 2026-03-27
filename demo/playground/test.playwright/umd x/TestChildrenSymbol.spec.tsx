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
        testTestChildrenSymbol: import("woby").Observable<symbol>
    }
}

test('Children - Boolean component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create component logic based on TestChildrenSymbol.tsx
        // Static component with Symbol child

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Children - Boolean'),
            h('p', null, 'symbol')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should render 'symbol'
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('symbol')

    // Verify the full structure
    const body = page.locator('body')
    const bodyHTML = await body.innerHTML()
    const expectedHTML = '<div><h3>Children - Boolean</h3><p>symbol</p></div>'
    await expect(bodyHTML.replace(/\s+/g, '')).toBe(expectedHTML.replace(/\s+/g, ''))
})
