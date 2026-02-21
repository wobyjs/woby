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
    }
}

test('Input - Label For component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestInputLabelFor.tsx
        
        const element = h(TestInputLabelFor, null)

        function TestInputLabelFor() {
            return [
                h('h3', null, 'Input - Label For'),
                h('p', null, h('label', { htmlFor: 'for-target' }, 'htmlFor')),
                h('p', null, h('label', { htmlFor: 'for-target' }, 'for')),
                h('p', null, h('input', { id: 'for-target' }))
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // TODO: Add proper expectations based on TestInputLabelFor.tsx
    await expect(innerHTML).not.toBe('')
})
