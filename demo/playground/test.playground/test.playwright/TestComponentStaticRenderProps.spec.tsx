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
        testComponentStaticRenderProps: number
    }
}

test('Component - Static Render Props component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Static component with render props - uses random() to generate value
        // [Implementation based on source file: TestComponentStaticRenderProps.tsx]

        // Implement random function from util.tsx
        const random = (): number => {
            const value = Math.random()
            if (value === 0 || value === 1) return random()
            return value
        }

        function TestComponentStaticRenderProps() {
            const propValue = random()
            window.testComponentStaticRenderProps = propValue  // Store observable for testing
            return [
                h('h3', null, 'Component - Static Render Props'),
                h('p', null, propValue)
            ]
        }

        const element = h(TestComponentStaticRenderProps, null)

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const heading = page.locator('h3')
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    await expect(heading).toHaveText('Component - Static Render Props')

    // Verify the paragraph contains the expected random value
    const propValue = await page.evaluate(() => window.testComponentStaticRenderProps)
    await expect(paragraph).toHaveText(`${propValue}`)

    // Verify the exact HTML structure
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    const expectedHTML = `<h3>Component - Static Render Props</h3><p>${propValue}</p>`
    await expect(bodyHTML).toBe(expectedHTML)
})

