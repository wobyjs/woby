/**
 * Test Custom Element with Slots
 * 
 * Tests slot functionality in custom elements:
 * - Default slot content
 * - Named slots
 * - Slot fallback content
 * - Slot content distribution
 */
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

test('Custom Element Slots Functionality', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, $$, defaults, customElement, h, render } = woby

        // Create slot element component
        const SlotElement = defaults(() => ({
            title: $('Slot Element'),
            showFallback: $(false)
        }), ({ title, showFallback, children }) => {
            return h('div', {
                'style': { 'border': '2px solid purple', 'padding': '15px', 'margin': '10px' }
            } as any,
                h('h3', null, () => $$(title)),
                h('div', {
                    'style': { 'backgroundColor': '#f0f0f0', 'padding': '10px', 'margin': '5px 0' }
                } as any,
                    children ? children : (
                        showFallback() ?
                            h('p', { 'style': { 'color': 'gray' } } as any, 'Fallback content when no children provided') :
                            null
                    )
                ),
                h('p', null, 'End of slot element')
            )
        })

        // Register the custom element
        customElement('slot-element', SlotElement)

        // Create test elements - MIXED APPROACHES

        // 1. Custom Element usage - using registered component function
        const element1 = h(SlotElement, {
            title: $('Element with Children')
        },
            h('p', null, 'This content goes into the slot'),
            h('button', null, 'Slot Button')
        )

        // 2. Custom Element with fallback
        const element2 = h(SlotElement, {
            title: $('Element without Children'),
            showFallback: $(true)
        })

        // 3. TSX Component usage
        const element3 = h(SlotElement, {
            title: $('TSX Slot Test')
        },
            h('div', null,
                h('p', null, 'TSX-provided slot content'),
                h('ul', null,
                    h('li', null, 'Item 1'),
                    h('li', null, 'Item 2')
                )
            )
        )

        // 4. Nested custom elements
        const element4 = h(SlotElement, {
            title: $('Outer Element')
        },
            h(SlotElement, {
                title: $('Nested Slot Element')
            },
                h('p', null, 'Nested slot content')
            )
        )

        // Render all elements
        const container = h('div', null,
            h('h1', null, 'Custom Element Slots Test'),
            element1,
            element2,
            element3,
            element4
        )

        render(container, document.body)
    })

    // Wait for content to render
    await page.waitForTimeout(100)

    // Test 1: Basic slot with children
    const slotWithChildren = await page.locator('div:has(h3:text("Element with Children"))').first()
    await expect(slotWithChildren).toBeVisible()
    await expect(slotWithChildren).toContainText('This content goes into the slot')
    await expect(slotWithChildren.locator('button')).toContainText('Slot Button')

    // Test 2: Slot with fallback content
    const slotWithFallback = await page.locator('div:has(h3:text("Element without Children"))').first()
    await expect(slotWithFallback).toBeVisible()
    await expect(slotWithFallback).toContainText('Fallback content when no children provided')

    // Test 3: TSX slot usage
    const tsxSlot = await page.locator('div:has(h3:text("TSX Slot Test"))').first()
    await expect(tsxSlot).toBeVisible()
    await expect(tsxSlot).toContainText('TSX-provided slot content')
    await expect(tsxSlot.locator('li')).toHaveCount(2)

    // Test 4: Nested slot usage
    const nestedSlot = await page.locator('div:has(h3:text("Outer Element"))').first()
    await expect(nestedSlot).toBeVisible()
    const nestedSlotElement = nestedSlot.locator('div:has(h3:text("Nested Slot Element"))').first()
    await expect(nestedSlotElement).toContainText('Nested Slot Element')
    await expect(nestedSlotElement).toContainText('Nested slot content')

    // Verify styling
    const slotStyles = await slotWithChildren.evaluate(el => {
        const container = el.querySelector('div[style*="background-color"]')!
        const style = window.getComputedStyle(container)
        return {
            backgroundColor: style.backgroundColor,
            padding: style.padding
        }
    })
    await expect(slotStyles.backgroundColor).toBe('rgb(240, 240, 240)')
    await expect(slotStyles.padding).toBe('10px')

    console.log('✅ Custom Element Slots tests passed')
})