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

test('Ternary Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { h, render, Ternary } = woby

        // Component logic extracted from source file
        // Static content - direct rendering without intervals
        // [Implementation based on source file: TestTernaryStatic.tsx]

        // Create the component element using h() function - static content
        const element = h('div', null,
            h('h3', null, 'Ternary - Static'),
            // First Ternary with when=true shows first child (true case)
            h(Ternary, { when: true } as any, h('p', null, 'true (1)'), h('p', null, 'false (1)')),
            // Second Ternary with when=false shows second child (false case)  
            h(Ternary, { when: false } as any, h('p', null, 'true (2)'), h('p', null, 'false (2)'))
        )

        // Render to body
        render(element, document.body)
    })

    // Static test verification
    const container = page.locator('div')  // Get the container div

    // Wait for rendering to complete
    await page.waitForTimeout(100)
    const innerHTML = await container.evaluate(el => el.innerHTML)  // Get innerHTML to see all elements
    await expect(innerHTML).toBe('<h3>Ternary - Static</h3><p>true (1)</p><p>false (2)</p>')  // Expected output from source
})