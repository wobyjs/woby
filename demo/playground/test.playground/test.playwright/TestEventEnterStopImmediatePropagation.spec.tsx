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
        const { $, h, render, useInterval } = woby

        // Implement component logic based on TestEventEnterStopImmediatePropagation.tsx
        const element = h(TestEventEnterStopImmediatePropagation, null)

        function TestEventEnterStopImmediatePropagation() {
            let testit = true
            const outer = $(0)
            const inner = $(0)
            const ref = $(null)
            const refInner = $(null)
            const incrementOuter = () => {
                outer(prev => prev + 1)
                testit = false
            }
            const incrementInner = event => {
                event.stopImmediatePropagation()
                inner(prev => prev + 1)
                testit = false
            }

            // Programmatic event firing
            useInterval(() => {
                const button = ref()
                const innerButton = refInner()
                if (button) {
                    const event = new PointerEvent('pointerenter')
                    button.dispatchEvent(event)
                }
                if (innerButton) {
                    const event = new PointerEvent('pointerenter')
                    innerButton.dispatchEvent(event)
                }
            }, 100)

            return [
                h('h3', null, 'Event - Enter - Stop Immediate Propagation'),
                h('p', null,
                    h('button', { ref, onPointerEnter: incrementOuter }, outer,
                        h('button', { ref: refInner, onPointerEnter: incrementInner }, inner)
                    )
                )
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const outerButton = page.locator('p > button').first()
    const innerButton = page.locator('p > button > button').first()

    // Initial state: Both counters should be 0
    await page.waitForTimeout(50)
    let outerCount = await outerButton.textContent()
    let innerCount = await innerButton.textContent()
    await expect(outerCount).toBe('0')
    await expect(innerCount).toBe('0')

    // Step 1: Trigger outer button event - should increment outer counter
    await page.evaluate(() => {
        const button = document.querySelector('p > button')
        if (button) {
            const event = new PointerEvent('pointerenter')
            button.dispatchEvent(event)
        }
    })
    await page.waitForTimeout(50)
    outerCount = await outerButton.textContent()
    innerCount = await innerButton.textContent()
    await expect(outerCount).toBe('1')
    await expect(innerCount).toBe('0')

    // Step 2: Trigger inner button event - should increment inner counter but not outer due to stopImmediatePropagation
    await page.evaluate(() => {
        const innerButton = document.querySelector('p > button > button')
        if (innerButton) {
            const event = new PointerEvent('pointerenter')
            innerButton.dispatchEvent(event)
        }
    })
    await page.waitForTimeout(50)
    outerCount = await outerButton.textContent()
    innerCount = await innerButton.textContent()
    await expect(outerCount).toBe('1')  // Should remain 1 due to stopImmediatePropagation
    await expect(innerCount).toBe('1')  // Should increment to 1
})

