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

test('HTML - dangerouslySetInnerHTML - Observable String component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestHTMLDangerouslySetInnerHTMLObservableString.tsx
        const element = h(TestHTMLDangerouslySetInnerHTMLObservableString, null)

        function TestHTMLDangerouslySetInnerHTMLObservableString() {
            return [
                h('h3', null, 'HTML - dangerouslySetInnerHTML - Observable String'),
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
    await expect(innerHTML).toBe('<i>danger</i>')
})
