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

test('If Children Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, If } = woby

        // Component logic extracted from source file: TestIfChildrenObservable.tsx
        const o = $('initial_value')
        // Expose observable for testing
        // Use (window as any) to avoid TypeScript errors
        (window as any).testObservableIfChildrenObservable = o

        // Create the component element using h() function
        // Source returns a fragment with h3 and If
        const element = h('div', null,
            h('h3', null, 'If - Children Observable'),
            h(If, { when: true }, o)
        )
        
        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const container = page.locator('div')
    
    // Initial state verification
    await page.waitForTimeout(50)
    let innerHTML = await container.innerHTML()
    await expect(innerHTML).toContain('initial_value')
    await expect(innerHTML).toContain('<h3>If - Children Observable</h3>')
    
    // Update observable
    await page.evaluate(() => {
        (window as any).testObservableIfChildrenObservable('updated_value')
    })

    await page.waitForTimeout(50)
    innerHTML = await container.innerHTML()
    await expect(innerHTML).toContain('updated_value')
    await expect(innerHTML).not.toContain('initial_value')
})
