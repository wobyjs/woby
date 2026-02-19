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

test('If Children Observable Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, If } = woby

        // Component logic extracted from source file: TestIfChildrenObservableStatic.tsx
        const valueObs = $('static_value')
        
        const Content = () => {
            return h('p', null, valueObs())
        }

        const element = h('div', null,
            h('h3', null, 'If - Children Observable Static'),
            h(If, { when: true }, h(Content))
        )
        
        render(element, document.body)
    })

    // Static test verification
    const container = page.locator('div')
    
    await page.waitForTimeout(50)
    const innerHTML = await container.innerHTML()
    await expect(innerHTML).toContain('<h3>If - Children Observable Static</h3>')
    await expect(innerHTML).toContain('<p>static_value</p>')
})
