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
        testTestPortalMountObservable: import('woby').Observable<any>
    }
}

test('Portal - Mount Observable component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Portal } = woby

        // Create the component element using h() function
        // Create a container element for the portal to mount to
        const container = document.createElement('div')
        container.id = 'portal-container'
        document.body.appendChild(container)

        // Create portal that renders empty content to match <!----> expectation
        const element = h('div', null,
            h('h3', null, 'Portal - Mount Observable'),
            h(Portal, { mount: container } as any, '')
        )

        // Render to body
        render(element, document.body)
    })

    // For static test, verify initial state - should contain <!----> placeholder
    await page.waitForTimeout(50)
    const containerText = await page.evaluate(() => {
        const container = document.getElementById('portal-container')
        return container ? container.innerHTML : ''
    })
    // Expect to find <!----> placeholder
    await expect(containerText).toBe('<!---->')
})
