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



test('SVG - Class String component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'SVG - Class String'),
            h('svg', { className: 'red', viewBox: '0 0 50 50', width: '50px', strokeWidth: '3', fill: 'white' },
                h('circle', { cx: '25', cy: '25', r: '20' })
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const svgElement = page.locator('svg')

    // Initial state verification
    await expect(svgElement).toHaveCount(1)
    await expect(svgElement).toHaveAttribute('class', 'red')
    await expect(svgElement).toHaveAttribute('viewBox', '0 0 50 50')
    await expect(svgElement).toHaveAttribute('width', '50px')
    await expect(svgElement).toHaveAttribute('fill', 'white')

    const circleElement = page.locator('circle')
    await expect(circleElement).toHaveAttribute('cx', '25')
    await expect(circleElement).toHaveAttribute('cy', '25')
    await expect(circleElement).toHaveAttribute('r', '20')
})

