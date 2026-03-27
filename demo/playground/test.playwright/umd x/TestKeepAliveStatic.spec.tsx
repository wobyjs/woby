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

test('KeepAlive - Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, KeepAlive } = woby

        // Component logic extracted from source file
        // Static KeepAlive component with fixed content
        // [Implementation based on source file: TestKeepAliveStatic.tsx]
        
        const TestKeepAliveStatic = () => {
            return [
                h('h3', null, 'KeepAlive - Static'),
                h(KeepAlive, { id: 'static' },
                    h('p', null, '123')
                )
            ]
        }

        const element = h(TestKeepAliveStatic, null)

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const heading = page.locator('h3')
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    await expect(heading).toHaveText('KeepAlive - Static')
    await expect(paragraph).toHaveText('123')
    
    // Verify the exact HTML structure
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    const expectedHTML = '<h3>KeepAlive - Static</h3><p>123</p>'
    await expect(bodyHTML).toBe(expectedHTML)
})

