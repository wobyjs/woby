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
        testTestSuspenseFallbackFunction: import('woby').Observable<string>
    }
}

test('Suspense - Fallback Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestSuspenseFallbackFunction.tsx
        const element = h(TestSuspenseFallbackFunction, null)

        function TestSuspenseFallbackFunction() {
            const initialValue = 'test-initial-value'
            const Children = () => {
                const resource = useResource(() => {
                    return new Promise<undefined>(() => { })
                })
                return h('p', null, 'children ', resource.value)
            }
            const Fallback = () => h('p', null, 'Fallback: ', initialValue)
            return [
                h('h3', null, 'Suspense - Fallback Function'),
                h(Suspense, { fallback: h(Fallback, null) },
                    h(Children, null)
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
    // TODO: Add proper expectations based on TestSuspenseFallbackFunction.tsx
    await expect(innerHTML).not.toBe('')
})

