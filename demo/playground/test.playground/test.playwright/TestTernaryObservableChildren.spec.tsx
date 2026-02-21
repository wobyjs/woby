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
        testTernaryObservableChildren_state: import('woby').Observable<{ toggle: boolean; abActive: boolean; cdActive: boolean }>
        testTernaryObservableChildren_abToggle: () => void
        testTernaryObservableChildren_cdToggle: () => void
        testTernaryObservableChildren_mainToggle: () => void
    }
}

test('Ternary - Observable Children component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render, Ternary } = woby

        // Component logic extracted from source file
        // Dynamic content - uses useInterval to cycle through components
        // [Implementation based on source file: TestTernaryObservableChildren.tsx]

        // Track which component is currently active using a single state object
        const state = $({
            toggle: true,    // true = AB, false = CD
            abActive: true,  // true = <i>a</i>, false = <u>b</u>
            cdActive: true   // true = <b>c</b>, false = <span>d</span>
        })
        window.testTernaryObservableChildren_state = state  // Make observable accessible globally

        const AB = () => {
            const a = h('i', null, 'a')
            const b = h('u', null, 'b')
            const component = $(a)
            const toggle = () => {
                const newComponent = component() === a ? b : a
                const currentState = state()
                // Update both component and state atomically
                component(newComponent)
                state({
                    ...currentState,
                    abActive: newComponent === a
                })
            }
            window.testTernaryObservableChildren_abToggle = toggle
            return component
        }

        const CD = () => {
            const c = h('b', null, 'c')
            const d = h('span', null, 'd')
            const component = $(c)
            const toggle = () => {
                const newComponent = component() === c ? d : c
                const currentState = state()
                // Update both component and state atomically
                component(newComponent)
                state({
                    ...currentState,
                    cdActive: newComponent === c
                })
            }
            window.testTernaryObservableChildren_cdToggle = toggle
            return component
        }

        const toggleMain = () => {
            const currentState = state()
            state({
                ...currentState,
                toggle: !currentState.toggle
            })
        }
        window.testTernaryObservableChildren_mainToggle = toggleMain
        const o = () => state().toggle  // Use the toggle state as the ternary condition

        // Create the component element using h() function - dynamic content
        const element = h('div', null,
            h('h3', null, 'Ternary - Observable Children'),
            h(Ternary, { when: o } as any, AB(), CD())
        )

        // Render to body
        render(element, document.body)
    })

    // Step-by-step verification
    await page.waitForTimeout(50)

    // Initial state: should render <i>a</i> (AB component, abActive = true)
    let innerHTML = await page.evaluate(() => document.body.innerHTML)
    await expect(innerHTML).toContain('<i>a</i>')

    // Step 1: manually trigger AB toggle function
    await page.evaluate(() => {
        const toggle = window.testTernaryObservableChildren_abToggle
        toggle()
    })
    await page.waitForTimeout(50)
    innerHTML = await page.evaluate(() => document.body.innerHTML)
    await expect(innerHTML).toContain('<u>b</u>')

    // Step 2: manually trigger main toggle function (switch to CD)
    await page.evaluate(() => {
        const toggle = window.testTernaryObservableChildren_mainToggle
        toggle()
    })
    await page.waitForTimeout(50)
    innerHTML = await page.evaluate(() => document.body.innerHTML)
    await expect(innerHTML).toContain('<b>c</b>')

    // Step 3: manually trigger CD toggle function
    await page.evaluate(() => {
        const toggle = window.testTernaryObservableChildren_cdToggle
        toggle()
    })
    await page.waitForTimeout(50)
    innerHTML = await page.evaluate(() => document.body.innerHTML)
    await expect(innerHTML).toContain('<span>d</span>')

    // Step 4: manually trigger main toggle function (switch back to AB)
    await page.evaluate(() => {
        const toggle = window.testTernaryObservableChildren_mainToggle
        toggle()
    })
    await page.waitForTimeout(50)
    innerHTML = await page.evaluate(() => document.body.innerHTML)
    await expect(innerHTML).toContain('<u>b</u>')
})
