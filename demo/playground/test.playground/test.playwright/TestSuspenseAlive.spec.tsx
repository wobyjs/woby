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



test('Suspense - Alive component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestSuspenseAlive.tsx
        const Content = () => {
            return h('p', null, 'Content (0.123456)!')  // Static value
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Suspense - Alive'),
            h('woby-suspense', { when: true, fallback: h('p', null, 'Loading (0.789012)...') }, Content)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // Add proper expectations based on TestSuspenseAlive.tsx
    await expect(innerHTML).toBe('Loading (0.789012)...')
})

