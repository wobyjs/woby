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

test('HMR - For component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, For, hmr, useTimeout } = woby

        // Implement component logic based on TestHMRFor.tsx
        const element = h(TestHMRFor, null)

        function TestHMRFor() {
            const o = $([1, 2, 3])
            const Button = hmr(() => { }, ({ value, index }) => {
                return h('button', null, value, ', ', index)
            })
            return [
                h('h3', null, 'HMR - For'),
                h('p', null, 'prev'),
                h(For, { values: o },
                    (item, index) => h(Button, { value: item, index: index })
                ),
                h('p', null, 'next')
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Wait for rendering
    await page.waitForTimeout(100)
    
    // Get all button elements
    const buttons = await page.locator('button').all()
    
    // Verify the initial state - there should be 3 buttons
    expect(buttons.length).toBe(3)
    
    // Verify the content of each button
    const button1Text = await buttons[0].textContent()
    const button2Text = await buttons[1].textContent()
    const button3Text = await buttons[2].textContent()
    
    expect(button1Text?.trim()).toBe('1, 0')
    expect(button2Text?.trim()).toBe('2, 1')
    expect(button3Text?.trim()).toBe('3, 2')
})

