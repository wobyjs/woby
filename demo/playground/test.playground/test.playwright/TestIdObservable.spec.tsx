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
        testIdObservable: any
    }
}

test('ID - Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component logic extracted from source file
        // ID observable - toggles between 'foo' and 'bar'
        // [Implementation based on source file: TestIdObservable.tsx]
        
        function TestIdObservable() {
            const o = $('foo')
            window.testIdObservable = o  // Make observable accessible globally
            const toggle = () => o(prev => (prev === 'foo') ? 'bar' : 'foo')
            
            return [
                h('h3', null, 'ID - Observable'),
                h('p', { id: o }, 'content')
            ]
        }
        
        const element = h(TestIdObservable, null)

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const heading = page.locator('h3')
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    await expect(heading).toHaveText('ID - Observable')
    
    // Check initial ID value
    const initialId = await paragraph.evaluate(el => el.id)
    await expect(initialId).toBe('foo')
    await expect(paragraph).toHaveText('content')
    
    // Step 1: Toggle ID value
    await page.evaluate(() => {
        const o = window.testIdObservable
        const toggle = () => o(prev => (prev === 'foo') ? 'bar' : 'foo')
        toggle()
    })
    await page.waitForTimeout(50)
    const newId = await paragraph.evaluate(el => el.id)
    await expect(newId).toBe('bar')
})

