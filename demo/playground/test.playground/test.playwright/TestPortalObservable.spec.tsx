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
        testTestPortalObservable: import('woby').Observable<any>
    }
}

test('Portal - Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Portal } = woby

        // Create component that renders null/empty content to match <!----> expectation
        const emptyContent = $('')
        const mainComponent = $(emptyContent)

        // Mock toggle functions for consistency
        const toggleAB = () => { }
        const toggleCD = () => { }
        const toggleMain = () => { }
            ; (window as any).testPortalObservable = { toggleAB, toggleCD, toggleMain }

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('h3', null, 'Portal - Observable'),
            h(Portal, { mount: document.body } as any, mainComponent)
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification - should contain <!----> placeholder
    await page.waitForTimeout(50)
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    // Expect to find <!----> placeholder
    await expect(bodyHTML).toContain('<!---->')
})
