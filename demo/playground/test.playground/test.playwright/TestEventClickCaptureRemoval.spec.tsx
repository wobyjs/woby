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
        testEventClickCaptureRemoval: import('woby').Observable<number>
    }
}

test('Event - Click Capture Removal component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Event click capture removal - uses increment with null removal
        // [Implementation based on source file: TestEventClickCaptureRemoval.tsx]
        
        const o = $(0)
        const onClick = $(() => { })
        window.testEventClickCaptureRemoval = o  // Make observable accessible globally
        
        const increment = () => o(prev => {
            onClick(() => null)
            return prev + 1
        })
        
        onClick(() => increment)

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('h3', null, 'Event - Click Capture Removal'),
            h('p', null, 
                h('button', { onClickCapture: onClick }, o)
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state: should be 0
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<button>0</button>')
    
    // Step 1: First click -> increment (0 -> 1)
    await page.evaluate(() => {
        // Simulate click capture event
        const button = document.querySelector('button')
        if (button) {
            const event = new MouseEvent('click', { bubbles: true })
            button.dispatchEvent(event)
        }
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<button>1</button>')
    
    // Step 2: Second click -> should not increment (onClick is null)
    await page.evaluate(() => {
        const button = document.querySelector('button')
        if (button) {
            const event = new MouseEvent('click', { bubbles: true })
            button.dispatchEvent(event)
        }
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<button>1</button>')
    
    // Step 3: Third click -> should not increment
    await page.evaluate(() => {
        const button = document.querySelector('button')
        if (button) {
            const event = new MouseEvent('click', { bubbles: true })
            button.dispatchEvent(event)
        }
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<button>1</button>')
    
    // Step 4: Fourth click -> should not increment
    await page.evaluate(() => {
        const button = document.querySelector('button')
        if (button) {
            const event = new MouseEvent('click', { bubbles: true })
            button.dispatchEvent(event)
        }
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<button>1</button>')
})

