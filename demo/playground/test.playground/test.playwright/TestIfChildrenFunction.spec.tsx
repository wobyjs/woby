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
        testTestIfChildrenFunction: import('woby').Observable<string>
    }
}

test('If - Children Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestIfChildrenFunction.tsx
        const element = h(TestIfChildrenFunction, null)

        function TestIfChildrenFunction() {
            const initialValue = 'test-value'
            const valueObs = $(initialValue)
            const Content = () => h('p', null, valueObs())
            return [
                h('h3', null, 'If - Children Function'),
                h(If, { when: true }, h(Content, null))
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
    // TODO: Add proper expectations based on TestIfChildrenFunction.tsx
    await expect(innerHTML).not.toBe('')
})

