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

test('If Fallback Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, If } = woby

        // Component logic extracted from source file: TestIfFallbackFunction.tsx
        const initialValue = "0.123456"
        const Fallback = () => {
            return h('p', null, 'Fallback: ' + initialValue)
        }

        const element = h('div', null,
            h('h3', null, 'If - Fallback Function'),
            h(If, { when: false, fallback: Fallback }, 'Children')
        )
        
        render(element, document.body)
    })

    // Static test verification
    const container = page.locator('div')
    
    await page.waitForTimeout(50)
    const innerHTML = await container.innerHTML()
    await expect(innerHTML).toContain('<h3>If - Fallback Function</h3>')
    await expect(innerHTML).toContain('<p>Fallback: 0.123456</p>')
    await expect(innerHTML).not.toContain('Children')
})
