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
        testTestDynamicObservableChildren: import('woby').Observable<number>
    }
}

test('Dynamic - Observable Children component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestDynamicObservableChildren.tsx
        const o = $(Math.random())
        window.testTestDynamicObservableChildren = o
        const update = () => o(Math.random())

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Dynamic - Observable Children'),
            h('woby-dynamic', { component: 'h5' }, o)
        )

        // Render to body
        render(element, document.body)
    })

    // Wait for initial render
    await page.waitForTimeout(50)
    
    // Check for the h5 element that should be created by the Dynamic component
    const h5 = page.locator('h5').first()
    
    // Verify that the h5 element has content (the random number)
    const textContent = await h5.textContent()
    await expect(textContent).not.toBe('')
    
    // Verify the content is numeric (since it's a random number)
    await expect(parseFloat(textContent)).toBeGreaterThan(0)
})

