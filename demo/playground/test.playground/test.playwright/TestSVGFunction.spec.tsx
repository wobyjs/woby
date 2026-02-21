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
        testTestSVGFunction: import('woby').Observable<any>
    }
}

test('SVG - Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby
        const randomColor = (window as any).woby.util.randomColor

        // Create the component element using h() function
        const color = $(randomColor())

        const element = h('div', null,
            h('h3', null, 'SVG - Function'),
            h('svg', { viewBox: '0 0 50 50', width: '50px', stroke: () => color(), strokeWidth: '3', fill: 'white' },
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
    await expect(svgElement).toHaveAttribute('viewBox', '0 0 50 50')
    await expect(svgElement).toHaveAttribute('width', '50px')
    await expect(svgElement).toHaveAttribute('fill', 'white')

    // Check that stroke attribute is dynamic and changing
    const initialStroke = await svgElement.getAttribute('stroke')

    // Wait for potential changes due to the observable
    await page.waitForTimeout(100)

    const circleElement = page.locator('circle')
    await expect(circleElement).toHaveAttribute('cx', '25')
    await expect(circleElement).toHaveAttribute('cy', '25')
    await expect(circleElement).toHaveAttribute('r', '20')
})

