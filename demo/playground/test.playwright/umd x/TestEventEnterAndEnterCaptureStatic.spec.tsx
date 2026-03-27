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
        testTestEventEnterAndEnterCaptureStatic: import('woby').Observable<number>
    }
}

test('Event - Enter & Enter Capture Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        const o = $(0)
        const ref = $(null)
        window.testTestEventEnterAndEnterCaptureStatic = o  // Expose observable for testing
        const increment = () => o(prev => prev + 1)

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Event - Enter & Enter Capture Static'),
            h('p', null,
                h('button', {
                    ref,
                    onPointerEnter: increment,
                    onPointerEnterCapture: increment
                } as any, o)
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification for dynamic content
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<button>0</button>')

    // Trigger pointerenter event
    await page.hover('button')
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Both onPointerEnter and onPointerEnterCapture should increment, so value should be 2
    await expect(innerHTML).toBe('<button>2</button>')
})

