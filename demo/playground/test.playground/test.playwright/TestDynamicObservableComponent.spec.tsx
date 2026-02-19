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
        testObservableDynamicObservableComponent: import('woby').Observable<any>
    }
}

test('Dynamic Observable Component component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Dynamic, useMemo } = woby

        // Component logic extracted from source file
        // Dynamic content - with intervals or observables
        // [Implementation based on source file: TestDynamicObservableComponent.tsx]

        // Create the component element using h() function
        const level = $(1)
        const component = useMemo(() => `h${level()}`)

        const element = h('div', null,
            h('h3', null, 'Dynamic - Observable Component'),
            h(Dynamic, { component: component } as any,
                'Level: ', level
            )
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
    expect(innerHTML).toContain('<h3>Dynamic - Observable Component</h3>')
    expect(innerHTML).toContain('<h1>Level: 1</h1>')  // Based on source file expectation
})