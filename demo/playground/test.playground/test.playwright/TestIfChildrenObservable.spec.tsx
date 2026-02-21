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
        testTestIfChildrenObservable: import('woby').Observable<string>
    }
}

test('If - Children Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, If } = woby

        // Component logic extracted from source file
        // Dynamic content - with intervals or observables
        // [Implementation based on source file: TestIfChildrenObservable.tsx]

        const o = $(String(Math.random()))
        window.testTestIfChildrenObservable = o  // Expose observable for testing

        const randomize = () => o(String(Math.random()))

        // Set up interval to randomize the observable
        setInterval(randomize, 100)  // Using 100ms interval instead of TEST_INTERVAL

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'If - Children Observable'),
            h(If, { when: true } as any, o)  // Using the observable directly as the child
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification for dynamic content
    const container = page.locator('div')

    // Initial state verification
    await page.waitForTimeout(100)
    let innerHTML = await container.evaluate(el => el.innerHTML)

    // The content should show the initial value
    expect(innerHTML).toMatch(/<h3>If - Children Observable<\/h3>.*/)  // Should contain the header

    // Wait for the observable to change
    await page.waitForTimeout(150)
    const updatedHTML = await container.evaluate(el => el.innerHTML)

    // The content should have changed
    expect(updatedHTML).not.toEqual(innerHTML)
})
