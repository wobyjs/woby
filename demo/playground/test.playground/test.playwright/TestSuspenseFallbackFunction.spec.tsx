/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
// @ts-ignore
import fs from 'fs'
// @ts-ignore
import path from 'path'
// @ts-ignore
import { fileURLToPath } from 'url'
import type * as Woby from 'woby'
import { random } from './util.tsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Augment window type for test observables
declare global {
    interface Window {
        testSuspenseFallbackFunction: import('woby').Observable<string>
    }
}

test('Suspense - Fallback Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Suspense, useResource } = woby

        function random() {
            return Math.random().toString()
        }

        // Implement component logic based on TestSuspenseFallbackFunction.tsx
        const element = h(TestSuspenseFallbackFunction, null)

        function TestSuspenseFallbackFunction() {
            const initialValue = random()
            const o = $(initialValue)
            window.testSuspenseFallbackFunction = o  // Store observable for testing
            const Children = () => {
                const resource = useResource(() => {
                    return new Promise<undefined>(() => { })
                })
                return h('p', null, 'children ', resource.value)
            }
            const Fallback = () => h('p', null, 'Fallback: ', o)
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
    const heading = page.locator('h3')
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(100)  // Give time for suspense to show fallback
    await expect(heading).toHaveText('Suspense - Fallback Function')

    // Since the fallback shows, we expect to see the fallback content
    const textContent = await paragraph.textContent()
    await expect(textContent).toContain('Fallback: ')

    // Verify the exact HTML structure
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    // The fallback should be showing since the promise never resolves
    expect(bodyHTML).toContain('<h3>Suspense - Fallback Function</h3>')
    expect(bodyHTML).toContain('Fallback: ')

    // Verify the observable value matches what's shown in the fallback
    const observableValue = await page.evaluate(() => window.testSuspenseFallbackFunction())
    const paragraphText = await paragraph.textContent()
    expect(paragraphText).toContain(String(observableValue))
})

