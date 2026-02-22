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
        testTestStringObservableDeepStatic: import('woby').Observable<string>
    }
}

test('String - Observable Deep Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestStringObservableDeepStatic.tsx
        const element = h(TestStringObservableDeepStatic, null)

        function TestStringObservableDeepStatic() {
            const initialValue = "0.123456"
            const o = $(initialValue)
            const Deep = () => [
                h('h3', null, 'String - Observable Deep Static'),
                h('p', null, initialValue)
            ]
            return h(Deep, null)
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('0.123456')
})

