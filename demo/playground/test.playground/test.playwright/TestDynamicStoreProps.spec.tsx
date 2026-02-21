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
        testTestDynamicStoreProps: import('woby').Observable<{ class: string }>
    }
}

test('Dynamic - Store Props component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Dynamic } = woby

        // Implement component logic based on TestDynamicStoreProps.tsx
        const props = $( { class: 'red' } )
        
        const element = h(TestDynamicStoreProps, null)

        function TestDynamicStoreProps() {
            let count = 1
            return [
                h('h3', null, 'Dynamic - Store Props'),
                h(Dynamic, { component: 'div', props: props },
                    h('p', null, () => count++)
                )
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
    // TODO: Add proper expectations based on TestDynamicStoreProps.tsx
    await expect(innerHTML).not.toBe('')
})

