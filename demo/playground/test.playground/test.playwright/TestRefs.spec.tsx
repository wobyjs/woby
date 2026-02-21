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
        testTestRefs: import('woby').Observable<string>
    }
}

test('Refs component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestRefs.tsx
        const ref1 = $()
        const ref2 = $()
        
        const updateRefs = () => {
            const element1 = ref1()
            const element2 = ref2()
            if (!element1 || !element2) return
            const content1 = `Got ref1 - Has parent: ${!!element1.parentElement} - Is connected: ${!!element1.isConnected}`
            const content2 = `Got ref2 - Has parent: ${!!element2.parentElement} - Is connected: ${!!element2.isConnected}`
            element1.textContent = `${content1} / ${content2}`
        }
        
        // Simulate the ref assignment
        window.testTestRefs_ref1 = ref1
        window.testTestRefs_ref2 = ref2

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Refs'),
            h('p', { ref: [ref1, ref2, null, undefined] }, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestRefs.tsx
    await expect(innerHTML).toContain('Got ref1 - Has parent: true - Is connected: true')
    await expect(innerHTML).toContain('Got ref2 - Has parent: true - Is connected: true')
})

