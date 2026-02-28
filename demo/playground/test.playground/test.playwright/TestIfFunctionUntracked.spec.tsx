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

test('TestIfFunctionUntracked component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, If } = woby

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'TestIfFunctionUntracked'),
            h(If, { when: true } as any,
                h(If, { when: true, fallback: 'fallback' } as any, () => (
                    h('button', { onClick: () => { } }, 'Close')
                ))
            )
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Since both conditions are true, the button should be rendered
    const button = page.locator('button')
    await expect(button).toHaveText('Close')
})
