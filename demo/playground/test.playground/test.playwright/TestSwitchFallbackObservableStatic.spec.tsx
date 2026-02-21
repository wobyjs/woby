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
        testTestSwitchFallbackObservableStatic: import('woby').Observable<any>
    }
}

test('Switch - Fallback Observable Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Switch } = woby

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Switch - Fallback Observable Static'),
            h(Switch, { when: -1, fallback: h('p', null, 'Fallback: 0.123456') } as any,
                h(Switch.Case, { when: 0 } as any, h('p', null, 'case'))
            )
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Since when=-1 doesn't match any case, the fallback should be rendered
    const paragraph = page.locator('p')
    await expect(paragraph).toHaveText('Fallback: 0.123456')
})
