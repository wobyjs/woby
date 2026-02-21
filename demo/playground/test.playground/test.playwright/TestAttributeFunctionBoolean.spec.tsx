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
        testTestAttributeFunctionBoolean: import('woby').Observable<boolean>
    }
}

test('Attribute - Function Boolean component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, h, render } = woby

        // Component logic from TestAttributeFunctionBoolean.tsx
        const o = $(true)
        window.testTestAttributeFunctionBoolean = o

        const element = h('div', null,
            h('h3', null, 'Attribute - Function Boolean'),
            h('p', { 'data-red': () => String(!$$(o)) } as any, 'content')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should have data-red=false (since o() is true and !o() is false)
    await page.waitForTimeout(50)
    let attribute = await paragraph.getAttribute('data-red')
    await expect(attribute).toBe('false')

    // Step 1: change o to false -> data-red should become true
    await page.evaluate(() => {
        const o = window.testTestAttributeFunctionBoolean
        o(false)
    })
    await page.waitForTimeout(50)
    attribute = await paragraph.getAttribute('data-red')
    await expect(attribute).toBe('true')

    // Step 2: change o back to true -> data-red should become false
    await page.evaluate(() => {
        const o = window.testTestAttributeFunctionBoolean
        o(true)
    })
    await page.waitForTimeout(50)
    attribute = await paragraph.getAttribute('data-red')
    await expect(attribute).toBe('false')
})
