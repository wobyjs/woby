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
        testEventClickCaptureObservable: import('woby').Observable<number>
    }
}

test('Event - Click Capture Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // Event click capture with observable - uses plus2/minus1 pattern
        // [Implementation based on source file: TestEventClickCaptureObservable.tsx]
        
        const o = $(0)
        const onClick = $(() => { })
        window.testEventClickCaptureObservable = o  // Make observable accessible globally
        
        const plus2 = () => o(prev => {
            onClick(() => minus1)
            return prev + 2
        })
        
        const minus1 = () => o(prev => {
            onClick(() => plus2)
            return prev - 1
        })
        
        onClick(() => plus2)

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('h3', null, 'Event - Click Capture Observable'),
            h('p', null, 
                h('button', { onClickCapture: onClick }, o)
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')
    const button = page.locator('button')

    // Initial state: should be 0
    await page.waitForTimeout(50)
    let innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<button>0</button>')
    
    // Step 1: First click -> plus2 (0 -> 2)
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
    await expect(innerHTML).toBe('<button>2</button>')
    
    // Step 2: Second click -> minus1 (2 -> 1)
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
    
    // Step 3: Third click -> plus2 (1 -> 3)
    await page.evaluate(() => {
        const button = document.querySelector('button')
        if (button) {
            const event = new MouseEvent('click', { bubbles: true })
            button.dispatchEvent(event)
        }
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<button>3</button>')
    
    // Step 4: Fourth click -> minus1 (3 -> 2)
    await page.evaluate(() => {
        const button = document.querySelector('button')
        if (button) {
            const event = new MouseEvent('click', { bubbles: true })
            button.dispatchEvent(event)
        }
    })
    await page.waitForTimeout(50)
    innerHTML = await paragraph.evaluate(el => el.innerHTML)
    await expect(innerHTML).toBe('<button>2</button>')
})

