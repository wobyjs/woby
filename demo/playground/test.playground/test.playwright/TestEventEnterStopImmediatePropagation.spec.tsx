/** @jsxImportSource woby */
import test from '@playwright/test'
import expect from '@playwright/test'
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

        // Implement component logic based on TestEventEnterStopImmediatePropagation.tsx
        const element = h(TestEventEnterStopImmediatePropagation, null)

        function TestEventEnterStopImmediatePropagation() {
            const outer = $(0)
            const inner = $(0)
            const incrementOuter = () => {
                outer(prev => prev + 1)
            }
            const incrementInner = event => {
                event.stopImmediatePropagation()
                inner(prev => prev + 1)
            }
            return [
                h('h3', null, 'Event - Enter - Stop Immediate Propagation'),
                h('p', null,
                    h('button', { onPointerEnter: incrementOuter }, outer,
                        h('button', { onPointerEnter: incrementInner }, inner)
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
    // TODO: Add proper expectations based on TestEventEnterStopImmediatePropagation.tsx
    await expect(innerHTML).not.toBe('')
})

