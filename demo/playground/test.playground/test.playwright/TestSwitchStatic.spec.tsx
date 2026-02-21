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
        testTestSwitchStatic: import('woby').Observable<any>
    }
}

test('Switch - Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Switch } = woby

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Switch - Static'),
            h(Switch, { when: 2 } as any,
                h(Switch.Case, { when: 0 } as any, h('p', null, '0')),
                h(Switch.Case, { when: 1 } as any, h('p', null, '1')),
                h(Switch.Case, { when: 2 } as any, h('p', null, '2')),
                h(Switch.Default, {} as any, h('p', null, 'default'))
            )
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Since when is 2, the third case should be rendered
    const paragraph = page.locator('p')
    await expect(paragraph).toHaveText('2')
})
