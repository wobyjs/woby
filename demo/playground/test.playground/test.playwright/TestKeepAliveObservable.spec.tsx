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
        testTestKeepAliveObservable: import('woby').Observable<undefined>
    }
}

test('KeepAlive - Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestKeepAliveObservable.tsx
        const element = h(TestKeepAliveObservable, null)

        function TestKeepAliveObservable() {
            return [
                h('h3', null, 'KeepAlive - Observable'),
                h(If, { when: true },
                    h(KeepAlive, { id: 'observable-1' },
                        h('p', null, '0.123456')
                    )
                ),
                h(If, { when: true },
                    h(KeepAlive, { id: 'observable-2', ttl: 100 },
                        h('p', null, '0.789012')
                    )
                )
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // TODO: Add proper expectations based on TestKeepAliveObservable.tsx
    await expect(innerHTML).not.toBe('')
})
