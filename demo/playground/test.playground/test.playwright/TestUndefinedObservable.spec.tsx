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
        testUndefinedObservable: import("woby").Observable<string | undefined>
    }
}

test('Undefined - Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const o = $<string>(undefined)
        window.testUndefinedObservable = o  // Make observable accessible globally
        const toggle = () => o(prev => (prev === undefined) ? '' : undefined)

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Undefined - Observable'),
            h('p', null, o)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should be undefined -> empty placeholder
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('<!---->')

    // Step 1: undefined -> ''
    await page.evaluate(() => {
        const o = window.testUndefinedObservable
        const toggle = () => o(prev => (prev === undefined) ? '' : undefined)
        toggle()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('')

    // Step 2: '' -> undefined
    await page.evaluate(() => {
        const o = window.testUndefinedObservable
        const toggle = () => o(prev => (prev === undefined) ? '' : undefined)
        toggle()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('<!---->')
})
