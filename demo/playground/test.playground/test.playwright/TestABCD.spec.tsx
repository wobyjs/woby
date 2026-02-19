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

// Augment window type for testIndex
declare global {
    interface Window {
        testIndex: import('woby').Observable<number>
    }
}

test('Children - ABCD component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component logic based on source
        const states = [
            h('i', null, 'a'),
            h('u', null, 'b'),
            h('b', null, 'c'),
            h('span', null, 'd')
        ]
        const index = $(0)
        window.testIndex = index  // Make index accessible globally
        const increment = () => index(prev => (prev + 1) % states.length)

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Children - ABCD'),
            h('p', null, () => states[index()])
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should be '<i>a</i>'
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toContain('<i>a</i>')

    // Step 1: a -> b
    await page.evaluate(() => {
        const index = window.testIndex
        const increment = () => index(prev => (prev + 1) % 4)
        increment()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toContain('<u>b</u>')

    // Step 2: b -> c
    await page.evaluate(() => {
        const index = window.testIndex
        const increment = () => index(prev => (prev + 1) % 4)
        increment()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toContain('<b>c</b>')

    // Step 3: c -> d
    await page.evaluate(() => {
        const index = window.testIndex
        const increment = () => index(prev => (prev + 1) % 4)
        increment()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toContain('<span>d</span>')

    // Step 4: d -> a (cycle back)
    await page.evaluate(() => {
        const index = window.testIndex
        const increment = () => index(prev => (prev + 1) % 4)
        increment()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toContain('<i>a</i>')
})