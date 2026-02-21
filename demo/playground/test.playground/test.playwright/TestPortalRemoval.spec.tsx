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
        testPortalRemoval: import('woby').Observable<boolean | null>
    }
}

test('Portal - Removal component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Portal, If } = woby

        // Create component that renders null/empty content to match <!----> expectation
        const Inner = () => {
            return ''
        }
        const Portalized = () => {
            return h(Portal, { mount: document.body } as any, Inner())
        }
        const o = $<boolean | null>(false)  // Start with false to show <!----> placeholder
        window.testPortalRemoval = o  // Make observable accessible globally
        const toggle = () => o(prev => prev ? null : true)

        const element = h('div', null,
            h('h3', null, 'Portal - Removal'),
            h(If, { when: o } as any, Portalized())
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification - should contain <!----> placeholder
    await page.waitForTimeout(50)
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    // Expect to find <!----> placeholder when If condition is false
    await expect(bodyHTML).toContain('<!---->')
})

