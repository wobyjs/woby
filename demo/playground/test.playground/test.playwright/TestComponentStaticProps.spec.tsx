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
        testTestComponentStaticProps: import('woby').Observable<number>
    }
}

test('Component - Static Props component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Implement component logic based on TestComponentStaticProps.tsx
        const element = h(TestComponentStaticProps, { value: 42 })

        function TestComponentStaticProps(props) {
            return [
                h('h3', null, 'Component - Static Props'),
                h('p', null, props.value)
            ]
        }

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const paragraph = page.locator('p')

    // Initial state verification
    await page.waitForTimeout(50)
    const textContent = await paragraph.evaluate(el => el.textContent)
    // Add proper expectations based on TestComponentStaticProps.tsx
    await expect(textContent).toBe('42')
})

