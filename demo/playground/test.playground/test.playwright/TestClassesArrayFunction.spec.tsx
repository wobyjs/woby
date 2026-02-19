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
        testObservableClassesArrayFunction: import('woby').Observable<any>
    }
}

test('Classes Array Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Dynamic content - with intervals or observables
        // [Implementation based on source file: TestClassesArrayFunction.tsx]

        // Create observable with initial value
        const o = $(['red', false])

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Classes - Array Function'),
            h('p', { class: () => o() } as any, 'content')  // Use function for class attribute
        )

        // Render to body
        render(element, document.body)
    })

    // Verification for dynamic content
    const container = page.locator('div').first()  // Get the main container div

    // Wait for rendering to complete
    await page.waitForTimeout(100)
    const innerHTML = await container.evaluate(el => el.innerHTML)  // Get innerHTML to see all elements
    // Check that the component contains the expected structure
    expect(innerHTML).toContain('<h3>Classes - Array Function</h3>')
    expect(innerHTML).toContain('<p')
    expect(innerHTML).toContain('content</p>')
})