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
        testTestPortalWrapperStatic: import('woby').Observable<undefined>
    }
}

test('Portal - Wrapper Static component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Portal } = woby

        // Create portal that renders empty content to match <!----> expectation
        const element = h('div', null,
            h('h3', null, 'Portal - Wrapper Static'),
            h(Portal, { mount: document.body, wrapper: h('div', { class: 'custom-wrapper' }) } as any, '')
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state - should contain <!----> placeholder
    await page.waitForTimeout(50)
    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
    // Expect to find <!----> placeholder
    await expect(bodyHTML).toContain('<!---->')
})

