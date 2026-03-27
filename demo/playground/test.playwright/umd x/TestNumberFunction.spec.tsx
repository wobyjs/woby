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
        testNumberFunction: any
    }
}

test('Number - Function component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, $$ } = woby
        
        // Implement random function from util.tsx
        const random = (): number => {
            const value = Math.random()
            if (value === 0 || value === 1) return random()
            return value
        }

        // Component logic extracted from source file
        // Number function - uses random() to generate values
        // [Implementation based on source file: TestNumberFunction.tsx]
        
        function TestNumberFunction() {
            const o = $(random())
            window.testNumberFunction = o  // Make observable accessible globally
            const randomize = () => o(random())
            
            return [
                h('h3', null, 'Number - Function'),
                h('p', null, () => o())
            ]
        }
        
        const element = h(TestNumberFunction, null)

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should be a number string
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toMatch(/^\d+\.\d+$/)
    
    // Step 1: randomize the value
    await page.evaluate(() => {
        const o = window.testNumberFunction
        const randomize = () => o(Math.random())
        randomize()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toMatch(/^\d+\.\d+$/)
    
    // Step 2: randomize again
    await page.evaluate(() => {
        const o = window.testNumberFunction
        const randomize = () => o(Math.random())
        randomize()
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.innerHTML()
    await expect(innerHTML).toMatch(/^\d+\.\d+$/)
})

