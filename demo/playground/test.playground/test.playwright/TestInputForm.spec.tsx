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

test('Input - Input Form component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestInputForm.tsx
        
        const element = h(TestInputForm, null)

        function TestInputForm() {
            return [
                h('h3', null, 'Input - Input Form'),
                h('input', { form: undefined }),
                h('input', { form: null }),
                h('input', { form: 'foo' })
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Wait for rendering
    await page.waitForTimeout(50)
    
    // Get all input elements
    const inputs = await page.locator('input').all()
    
    // Verify there are three inputs
    expect(inputs.length).toBe(3)
    
    // Check the 'form' attribute of each input
    const firstInputForm = await inputs[0].getAttribute('form')
    const secondInputForm = await inputs[1].getAttribute('form')
    const thirdInputForm = await inputs[2].getAttribute('form')
    
    // First two inputs should not have form attribute (undefined/null in JSX becomes no attribute)
    expect(firstInputForm).toBe(null)
    expect(secondInputForm).toBe(null)
    // Third input should have form="foo"
    expect(thirdInputForm).toBe('foo')
})

