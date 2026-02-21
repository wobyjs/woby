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
    }
}

test('HTML - dangerouslySetInnerHTML - Function String component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestHTMLDangerouslySetInnerHTMLFunctionString.tsx
        
        const element = h(TestHTMLDangerouslySetInnerHTMLFunctionString, null)

        function TestHTMLDangerouslySetInnerHTMLFunctionString() {
            return [
                h('h3', null, 'HTML - dangerouslySetInnerHTML - Function String'),
                h('p', { dangerouslySetInnerHTML: { __html: '<i>danger</i>' } }, null)
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // TODO: Add proper expectations based on TestHTMLDangerouslySetInnerHTMLFunctionString.tsx
    await expect(innerHTML).not.toBe('')
})
