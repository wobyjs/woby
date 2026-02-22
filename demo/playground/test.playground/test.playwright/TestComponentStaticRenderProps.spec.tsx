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
        testComponentStaticRenderProps: any
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
        
        // Define the random function as in the source file
        const random = () => {
            const value = Math.random()
            return value
        }
        
        const TestComponentStaticRenderProps = ({ value }) => {
            const propValue = random()
            window.testComponentStaticRenderProps = propValue  // Store the actual value
            
            return [
                h('h3', null, 'Component - Static Render Props'),
                h('p', null, propValue)
            ]
        }

        const element = h(TestComponentStaticRenderProps, { value: 42 })

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const heading = page.locator('h3')
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    await expect(heading).toHaveText('Component - Static Render Props')
    
    // Get the value from window and verify
    const propValue = await page.evaluate(() => window.testComponentStaticRenderProps)
    await expect(paragraph).toHaveText(`${propValue}`)
})

