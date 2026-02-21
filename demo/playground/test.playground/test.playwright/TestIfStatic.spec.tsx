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
        testTestIfStatic: import('woby').Observable<undefined>
    }
}

test('If - Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, If } = woby

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'If - Static'),
            h(If, { when: true } as any, h('p', null, 'true')),
            h(If, { when: false } as any, h('p', null, 'false'))
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state
    // Only the true case should be rendered
    const paragraph = page.locator('p')
    await expect(paragraph).toHaveCount(1)
    await expect(paragraph).toHaveText('true')
})
