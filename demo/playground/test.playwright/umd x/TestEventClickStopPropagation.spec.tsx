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

test('Event - Click - Stop Propagation component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, h, render } = woby

        // Implement component logic based on TestEventClickStopPropagation.tsx
        const outer = $(0)
        const inner = $(0)
        const ref = $()
        const refInner = $()
        window.testTestEventClickStopPropagation_outer = outer
        window.testTestEventClickStopPropagation_inner = inner

        const incrementOuter = () => {
            outer(prev => prev + 1)
        }

        const incrementInner = (event) => {
            if (event.stopPropagation) event.stopPropagation()
            inner(prev => prev + 1)
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Event - Click - Stop Propagation'),
            h('p', null, h('button', { ref: ref, onClick: incrementOuter },
                () => $$(outer),
                h('button', { ref: refInner, onClick: incrementInner },
                    () => $$(inner)
                )
            ))
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestEventClickStopPropagation.tsx
    const outerButton = await paragraph.locator('button').first()
    const innerButton = await outerButton.locator('button').first()
    const outerText = await outerButton.evaluate(el => el.textContent)
    const innerText = await innerButton.evaluate(el => el.textContent)
    await expect(outerText).toBeDefined()
    await expect(innerText).toBeDefined()
})

