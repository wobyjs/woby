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
        testAttributeObservable: import("woby").Observable<string>
    }
}

test('Attribute - Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic from TestAttributeObservable.tsx
        const o = $('red')
        window.testAttributeObservable = o
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')

        const element = h('div', null,
            h('h3', null, 'Attribute - Observable'),
            h('p', { 'data-color': o }, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should have data-color="red"
    await page.waitForTimeout(50)
    let attribute = await paragraph.getAttribute('data-color')
    await expect(attribute).toBe('red')

    // Step 1: red -> blue
    await page.evaluate(() => {
        const o = window.testAttributeObservable
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
        toggle()
    })
    await page.waitForTimeout(50)
    attribute = await paragraph.getAttribute('data-color')
    await expect(attribute).toBe('blue')

    // Step 2: blue -> red
    await page.evaluate(() => {
        const o = window.testAttributeObservable
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
        toggle()
    })
    await page.waitForTimeout(50)
    attribute = await paragraph.getAttribute('data-color')
    await expect(attribute).toBe('red')
})
