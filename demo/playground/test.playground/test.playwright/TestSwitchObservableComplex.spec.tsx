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
        // No observable exposed to window in this test
    }
}

test('Switch - Observable Complex component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Switch } = woby

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Switch - Observable Complex'),
            h(Switch, { when: 0 } as any,
                h(Switch.Case, { when: 0 } as any, h('p', null, '1 - 0')),
                h(Switch.Case, { when: 1 } as any, h('p', null, '1 - 1')),
                h(Switch.Case, { when: 2 } as any, h('p', null, '1 - 2'))
            ),
            h(Switch, { when: 2 } as any,
                h(Switch.Case, { when: 0 } as any, h('p', null, '2 - 0')),
                h(Switch.Case, { when: 1 } as any, h('p', null, '2 - 1')),
                h(Switch.Case, { when: 2 } as any, h('p', null, '2 - 2'))
            ),
            h(Switch, { when: 4 } as any,
                h(Switch.Case, { when: 0 } as any, h('p', null, '3 - 0')),
                h(Switch.Case, { when: 1 } as any, h('p', null, '3 - 1')),
                h(Switch.Case, { when: 2 } as any, h('p', null, '3 - 2'))
            )
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // First switch with when=0 should render case 0 -> '1 - 0'
    // Second switch with when=2 should render case 2 -> '2 - 2'
    // Third switch with when=4 should render nothing (no matching case)
    const paragraphs = page.locator('p')
    await expect(paragraphs).toHaveCount(2)
    await expect(paragraphs.first()).toHaveText('1 - 0')
    await expect(paragraphs.last()).toHaveText('2 - 2')
})
