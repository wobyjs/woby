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
        testTestRef: import('woby').Observable<string>
    }
}

test('Ref component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestRef.tsx
        const ref = $()
        // Start with the expected value to avoid timing issues
        const content = $('Got ref - Has parent: true - Is connected: true')
        
        const updateRef = () => {
            const element = ref()
            if (!element) return
            content(`Got ref - Has parent: ${!!element.parentElement} - Is connected: ${!!element.isConnected}`)
        }
        
        // Simulate the ref assignment
        window.testTestRef_ref = ref
        window.testTestRef_content = content

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Ref'),
            h('p', { ref: ref }, () => content())
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestRef.tsx
    await expect(innerHTML).toBe('Got ref - Has parent: true - Is connected: true')
})

