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
        testTestBigIntRemoval: import('woby').Observable<bigint | null>
    }
}

test('BigInt - Removal component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, h, render } = woby

        // Component logic from TestBigIntRemoval.tsx
        const o = $<bigint | null>(null)
        window.testTestBigIntRemoval = o

        const element = h('div', null,
            h('h3', null, 'BigInt - Removal'),
            h('p', null, o)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should have <!----> placeholder for null value
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('(<!---->)')

    // Step 1: change o to a BigInt value
    await page.evaluate(() => {
        const o = window.testTestBigIntRemoval
        o(BigInt(456))
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('(456n)')

    // Step 2: change o back to null
    await page.evaluate(() => {
        const o = window.testTestBigIntRemoval
        o(null)
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('(<!---->)')
})
