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
        testTestChildrenBoolean: import("woby").Observable<boolean>
    }
}

test('Children - Boolean component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create component logic based on TestChildrenBoolean.tsx
        // Static component with boolean children

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Children - Boolean'),
            h('p', null, 1),
            h('p', null, 0)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraphs = page.locator('p')

    // Initial state: should render two paragraphs with 1 and 0
    await page.waitForTimeout(50)
    const count = await paragraphs.count()
    await expect(count).toBe(2)

    const firstHTML = await paragraphs.nth(0).innerHTML()
    await expect(firstHTML).toBe('1')

    const secondHTML = await paragraphs.nth(1).innerHTML()
    await expect(secondHTML).toBe('0')

    // Verify the full structure
    const body = page.locator('body')
    const bodyHTML = await body.innerHTML()
    const expectedHTML = '<div><h3>Children - Boolean</h3><p>1</p><p>0</p></div>'
    await expect(bodyHTML.replace(/\s+/g, '')).toBe(expectedHTML.replace(/\s+/g, ''))
})
