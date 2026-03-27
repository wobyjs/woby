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
        testTestCleanupInner: import('woby').Observable<boolean>
    }
}

test('Cleanup - Inner component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestCleanupInner.tsx
        const element = h(TestCleanupInner, null)

        function TestCleanupInner() {
            const page = $(true)
            const togglePage = () => page(prev => !prev)
            const Page1 = () => [
                h('p', null, 'page1'),
                h('button', { onClick: togglePage }, 'Toggle Page')
            ]
            const Page = page() ? Page1 : null
            return [
                h('h3', null, 'Cleanup - Inner'),
                h(Page, null)
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')
    const button = page.locator('button')

    // Initial state verification
    await page.waitForTimeout(50)
    const paragraphText = await paragraph.evaluate(el => el.textContent)
    const buttonText = await button.evaluate(el => el.textContent)
    
    // Add proper expectations based on TestCleanupInner.tsx
    await expect(paragraphText).toBe('page1')
    await expect(buttonText).toBe('Toggle Page')
})
