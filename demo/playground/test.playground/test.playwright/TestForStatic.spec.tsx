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
        testTestForStatic: import('woby').Observable<undefined>
    }
}

test('For - Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, For } = woby

        // Component logic extracted from source file
        // For content - static array rendering
        // [Implementation based on source file: TestForStatic.tsx]

        // Create the component element using h() function - For component
        const values = [1, 2, 3]

        const element = h('div', null,
            h('h3', null, 'For - Static'),
            h(For, {
                values: values,
                children: (value: number) => h('p', null, 'Value: ', value)
            } as any)
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Check that all values are rendered
    await page.waitForTimeout(50)
    const paragraphs = await page.$$('p')
    await expect(paragraphs.length).toBe(3)

    const firstText = await paragraphs[0].evaluate(el => el.textContent)
    const secondText = await paragraphs[1].evaluate(el => el.textContent)
    const thirdText = await paragraphs[2].evaluate(el => el.textContent)

    await expect(firstText).toBe('Value: 1')
    await expect(secondText).toBe('Value: 2')
    await expect(thirdText).toBe('Value: 3')
})

