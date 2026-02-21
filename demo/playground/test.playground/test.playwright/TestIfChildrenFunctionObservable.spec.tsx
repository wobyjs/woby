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
        testTestIfChildrenFunctionObservable: import('woby').Observable<boolean>
    }
}

test('If - Children Function Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, If } = woby

        // Create component that renders <!----> placeholder when condition is false
        const o = $(false)  // Start with false to show <!----> placeholder
        window.testTestIfChildrenFunctionObservable = o  // Expose observable for testing

        // Simple toggle function
        const toggle = () => { }

        const Content = (props: { value: string }) => {
            return h('p', null, 'Value: ', props.value)
        }

        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'If - Children Function Observable'),
            h(If, { when: o } as any, (value: string) => h(Content, { value }))
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const container = page.locator('div')

    // Initial state verification - should contain <!----> placeholder
    await page.waitForTimeout(50)
    const innerHTML = await container.evaluate(el => el.innerHTML)
    // Expect to find <!----> placeholder when If condition is false
    await expect(innerHTML).toContain('<!---->')
})
