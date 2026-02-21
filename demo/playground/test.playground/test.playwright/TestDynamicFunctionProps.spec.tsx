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
        testTestDynamicFunctionProps: import('woby').Observable<{ class: string }>
    }
}

test('Dynamic - Function Props component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Dynamic, $$ } = woby

        // Component logic extracted from source file
        // Dynamic content - uses manual toggle to switch between red and blue props
        // [Implementation based on source file: TestDynamicFunctionProps.tsx]

        const red = { class: 'red' }
        const blue = { class: 'blue' }
        window.testTestDynamicFunctionProps_red = red  // Make red accessible globally
        window.testTestDynamicFunctionProps_blue = blue  // Make blue accessible globally
        const props = $(red)
        window.testTestDynamicFunctionProps = props  // Make observable accessible globally
        const toggle = () => props(prev => prev === red ? blue : red)

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('h3', null, 'Dynamic - Function Props'),
            h(Dynamic, { component: 'h5', props: props } as any,
                'Content'
            )
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    const dynamicElement = page.locator('h5')

    // Initial state: should have red class
    await page.waitForTimeout(50)
    let className = await dynamicElement.evaluate(el => el.className)
    await expect(className).toBe('red')

    // Step 1: toggle to blue
    await page.evaluate(() => {
        const props = window.testTestDynamicFunctionProps
        const red = window.testTestDynamicFunctionProps_red
        const blue = window.testTestDynamicFunctionProps_blue
        const toggle = () => props(prev => prev === red ? blue : red)
        toggle()
    })
    await page.waitForTimeout(50)
    className = await dynamicElement.evaluate(el => el.className)
    await expect(className).toBe('blue')

    // Step 2: toggle back to red
    await page.evaluate(() => {
        const props = window.testTestDynamicFunctionProps
        const red = window.testTestDynamicFunctionProps_red
        const blue = window.testTestDynamicFunctionProps_blue
        const toggle = () => props(prev => prev === red ? blue : red)
        toggle()
    })
    await page.waitForTimeout(50)
    className = await dynamicElement.evaluate(el => el.className)
    await expect(className).toBe('red')
})

