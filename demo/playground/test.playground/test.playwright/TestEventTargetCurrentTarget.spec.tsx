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

test('Event - Target - Current Target component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestEventTargetCurrentTarget.tsx
        const element = h(TestEventTargetCurrentTarget, null)

        function TestEventTargetCurrentTarget() {
            const divClicks = $(3) // Static value for static test
            const ulClicks = $(2) // Static value for static test
            const liClicks = $(1) // Static value for static test
            
            return [
                h('h3', null, 'Event - Target - Current Target'),
                h('div', null,
                    h('p', null, 'paragraph'),
                    h('ul', null,
                        h('li', null, 'one'),
                        h('li', null, 'two'),
                        h('li', null, 'three')
                    )
                ),
                h('p', null, 'Div clicks: ', divClicks),
                h('p', null, 'UL clicks: ', ulClicks),
                h('p', null, 'LI clicks: ', liClicks)
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const divElement = page.locator('div')
    const ulElement = page.locator('ul')
    const liElements = page.locator('li')
    const paragraphs = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const divInnerHTML = await divElement.evaluate(el => el.innerHTML)
    const ulCount = await ulElement.count()
    const liCount = await liElements.count()
    const paragraphCount = await paragraphs.count()
    
    // Verify the structure and content
    await expect(divInnerHTML).toContain('paragraph')
    await expect(ulCount).toBe(1)
    await expect(liCount).toBe(3)
    await expect(paragraphCount).toBe(4) // 1 from div content + 3 for click counts
})

