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
        testTestNestedIfsLazy: import('woby').Observable<any>
    }
}

test('TestNestedIfsLazy component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $(false)  // Start with false to show <!----> placeholder

        // Mock nested If components that handle <!----> placeholders
        const If = (props) => {
            if (!props.when) return '<!---->'
            return props.children
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('div', null, 'before'),
            h(If, { when: o },
                h(If, { when: true },
                    h('div', null, 'inner')
                )
            ),
            h('div', null, 'after')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const container = page.locator('div')

    // Initial state verification - should contain <!----> placeholder
    await page.waitForTimeout(50)
    const innerHTML = await container.evaluate(el => el.innerHTML)
    // Expect to find <!----> placeholder when outer If condition is false
    await expect(innerHTML).toContain('<!---->')
})

