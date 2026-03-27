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
    }
}

test('Children component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create component logic based on TestChildren.tsx
        // Static component with nested divs

        const A = ({ children }) => h('div', { class: 'A' }, children)
        const B = ({ children }) => h('div', { class: 'B' }, children)
        const C = ({ children }) => h('div', { class: 'C' }, children)

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Children'),
            h(A, null,
                h(B, null,
                    h(C, null,
                        h('p', null, 'content')
                    )
                )
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should render the content
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toBe('content')

    // Verify the full structure
    const body = page.locator('body')
    const bodyHTML = await body.innerHTML()
    const expectedHTML = '<div><h3>Children</h3><div class="A"><div class="B"><div class="C"><p>content</p></div></div></div></div>'
    await expect(bodyHTML.replace(/\s+/g, '')).toBe(expectedHTML.replace(/\s+/g, ''))
})
