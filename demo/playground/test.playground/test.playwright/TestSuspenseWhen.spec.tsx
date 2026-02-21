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



test('Suspense - When component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Suspense } = woby

        // Create the component element using h() function
        const Content = () => {
            return h('p', null, 'Content!')
        }

        const element = h('div', null,
            h('h3', null, 'Suspense - When'),
            h(Suspense, { when: true, fallback: h('p', null, 'Loading...') } as any,
                Content()
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    // According to the test expectation, Suspense should show loading initially
    await expect(paragraph).toHaveCount(1)
    await expect(paragraph).toHaveText('Loading...')
})

