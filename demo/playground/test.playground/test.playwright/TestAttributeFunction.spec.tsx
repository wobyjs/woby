/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
// @ts-ignore
import fs from 'fs'
// @ts-ignore
import path from 'path'
// @ts-ignore
import { fileURLToPath } from 'url'
import { useEffect } from 'woby'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Augment window type for test observables
declare global {
    interface Window {
        testTestAttributeFunction: import("woby").Observable<string>
    }
}

test('Attribute - Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const { $, $$, useEffect, h, render } = (window as any).woby

        // Component logic from TestAttributeFunction.tsx
        const o = $('red')
        window.testTestAttributeFunction = o
        const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')

        useEffect(() => {
            const interval = setInterval(toggle, 1000)
            return () => clearInterval(interval)
        }, [])

        const element = h('div', null,
            h('h3', null, 'Attribute - Function'),
            h('p', { 'data-color': () => `dark${$$(o)}` } as any, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should have data-color="darkred"
    await page.waitForTimeout(1100)
    let attribute = await paragraph.getAttribute('data-color')
    await expect(attribute).toBe('darkred')

    // Step 1: red -> blue (after 1 second)
    await page.waitForTimeout(1100)
    attribute = await paragraph.getAttribute('data-color')
    await expect(attribute).toBe('darkblue')

    // Step 2: blue -> red (after another second)
    await page.waitForTimeout(1100)
    attribute = await paragraph.getAttribute('data-color')
    await expect(attribute).toBe('darkred')
})
