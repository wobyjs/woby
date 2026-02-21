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

// Augment window type for test observables
declare global {
    interface Window {
    }
}

test('Directive - Ref component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestDirectiveRef.tsx
        const model = (element, arg1) => {
            useEffect(() => {
                const value = `${arg1}`
                element.value = value
                element.setAttribute('value', value)
            }, { sync: true })
        }
        const Model = createDirective('model', model)
        
        const element = h(TestDirectiveRef, null)

        function TestDirectiveRef() {
            return [
                h('h3', null, 'Directive - Ref'),
                h('input', { ref: Model.ref('bar'), value: 'foo' })
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const innerHTML = await paragraph.evaluate(el => el.innerHTML)
    // TODO: Add proper expectations based on TestDirectiveRef.tsx
    await expect(innerHTML).not.toBe('')
})

