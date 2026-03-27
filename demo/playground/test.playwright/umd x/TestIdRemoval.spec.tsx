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
        testTestIdRemoval: import('woby').Observable<string | null>
    }
}

test('ID - Removal component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, $$ } = woby

        // Implement component logic based on TestIdRemoval.tsx
        const element = h(TestIdRemoval, null)

        function TestIdRemoval() {
            const o = $<string | null>(null)  // Start with null to test removal
            return [
                h('h3', null, 'ID - Removal'),
                h('p', { id: o }, 'content')
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const id = await paragraph.evaluate(el => el.id)
    // Add proper expectations based on TestIdRemoval.tsx
    await expect(id).toBe('')  // Should be empty string when o is null
    const textContent = await paragraph.evaluate(el => el.textContent)
    await expect(textContent).toBe('content')
})
