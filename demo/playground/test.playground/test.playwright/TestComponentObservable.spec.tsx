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
        testObservableComponentObservable: import('woby').Observable<any>
    }
}

test('Component Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Dynamic content - with intervals or observables
        // [Implementation based on source file: TestComponentObservable.tsx]

        // Create observable with initial random value
        const getRandom = (): number => Math.floor(Math.random() * 100)
        const o = $(getRandom())

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Component - Observable'),
            h('p', null, o)  // Source has <p>{o}</p>
        )

        // Render to body
        render(element, document.body)
    })

    // Verification for dynamic content
    const container = page.locator('div')  // Get the container div

    // Wait for rendering to complete
    await page.waitForTimeout(100)
    const innerHTML = await container.evaluate(el => el.innerHTML)  // Get innerHTML to see all elements
    // Check that the component contains a paragraph with some numeric content
    expect(innerHTML).toContain('<p>')  // Should contain paragraph element
    expect(innerHTML).toMatch(/<p>\d+<\/p>/)  // Should contain a number
})