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
    }
}

test('Event - Enter - Stop Immediate Propagation component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic from source - static test
        const outer = $(0)
        const inner = $(0)
        window.testEventEnterStopImmediatePropagation_outer = outer
        window.testEventEnterStopImmediatePropagation_inner = inner

        const onEnterOuter = $(() => { })
        const onEnterInner = $(() => { })

        const incrementInner = event => {
            event.stopImmediatePropagation()
            inner(prev => prev + 1)
        }

        // Register event handlers to observables
        onEnterOuter(() => {})
        onEnterInner(() => incrementInner)

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Event - Enter - Stop Immediate Propagation'),
            h('p', null,
                h('button',
                    {
                        onPointerEnter: onEnterOuter
                    },
                    outer,
                    h('button',
                        {
                            onPointerEnter: onEnterInner
                        },
                        inner
                    )
                )
            )
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    await page.waitForTimeout(50)
    const outerValue = await page.evaluate(() => window.testEventEnterStopImmediatePropagation_outer())
    const innerValue = await page.evaluate(() => window.testEventEnterStopImmediatePropagation_inner())
    await expect(outerValue).toBe(0)
    await expect(innerValue).toBe(0)
})

