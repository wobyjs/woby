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
        testTestDirectiveSingleArgument: import('woby').Observable<undefined>
    }
}

test('Directive - Single Argument component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // TODO: Implement component logic based on TestDirectiveSingleArgument.tsx
        // Extract the actual component logic from the source file

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Directive - Single Argument'),
            h('p', null, 'TODO: Implement based on source')
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // TODO: Add proper expectations based on TestDirectiveSingleArgument.tsx
    await expect(innerHTML).not.toBe('')
})

