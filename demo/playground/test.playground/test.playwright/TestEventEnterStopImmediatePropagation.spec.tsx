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
        const incrementInner = event => {
            event.stopImmediatePropagation()
            inner(prev => prev + 1)
        }
        
        // Only use incrementInner (the source only fires inner event)
        onEnterInner(() => incrementInner)

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Event - Enter - Stop Immediate Propagation'),
            h('p', null,
                h('button', 
                    { 
                        onPointerEnter: onEnterOuter 
                    }, 
                    '0',
                    h('button', 
                        { 
                            onPointerEnter: onEnterInner
                        }, 
                        '0'
                    )
                )
            )
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    const outerButton = page.locator('p > button').first()
    const innerButton = page.locator('p > button > button').first()

    await page.waitForTimeout(50)
    let outerCount = await outerButton.textContent()
    let innerCount = await innerButton.textContent()
    await expect(outerCount).toBe('0')
    await expect(innerCount).toBe('0')
})

