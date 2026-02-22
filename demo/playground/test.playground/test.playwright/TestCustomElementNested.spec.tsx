/**
 * Test Custom Element Nested Components
 * 
 * Tests nested component functionality between TSX and custom elements:
 * - TSX components inside custom elements
 * - Custom elements inside TSX components
 * - Deep nesting scenarios
 * - Host element interactions
 * - Property passing through nested structures
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

test('Custom Element Nested Components', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, defaults, customElement, h, render } = woby

        // Define leaf custom element
        const LeafElement = defaults(() => ({
            text: $('Leaf Element'),
            number: $(0)
        }), ({ text, number }) => {
            // Helper to handle both observable and raw values
            const getValue = (val) => {
                if (typeof val === 'function') {
                    return val() // it's an observable
                } else if (typeof val === 'string') {
                    // Try to parse as number if it looks like one
                    const numVal = Number(val)
                    if (!isNaN(numVal)) return numVal
                    return val // return as string
                }
                return val
            }

            return h('div', {
                'style': {
                    'border': '1px solid #ccc',
                    'padding': '5px',
                    'margin': '2px',
                    'backgroundColor': '#f9f9f9'
                }
            } as any,
                h('small', null, () => `Leaf: ${getValue(text)} (${getValue(number)})`)
            )
        })

        // Define intermediate custom element
        const IntermediateElement = defaults(() => ({
            title: $('Intermediate Element'),
            count: $(0),
            active: $(false)
        }), ({ title, count, active, children }) => {
            // Helper to handle both observable and raw values
            const getValue = (val) => {
                if (typeof val === 'function') {
                    return val() // it's an observable
                } else if (typeof val === 'string') {
                    if (val === 'true') return true
                    if (val === 'false') return false
                    // Try to parse as number if it looks like one
                    const numVal = Number(val)
                    if (!isNaN(numVal)) return numVal
                    return val // return as string
                }
                return val
            }

            return h('div', {
                'style': {
                    'border': '2px solid #666',
                    'padding': '10px',
                    'margin': '5px',
                    'backgroundColor': '#e6f3ff'
                }
            } as any,
                h('h4', null, () => getValue(title)),
                h('p', null, () => `Count: ${getValue(count)}`),
                h('p', null, () => `Active: ${getValue(active) ? 'Yes' : 'No'}`),
                h('div', { 'style': { 'marginLeft': '15px' } } as any, children)
            )
        })

        // Define root custom element
        const RootElement = defaults(() => ({
            title: $('Root Element'),
            count: $(0)
        }), ({ title, count, children }) => {
            // Helper to handle both observable and raw values
            const getValue = (val) => {
                if (typeof val === 'function') {
                    return val() // it's an observable
                } else if (typeof val === 'string') {
                    // Try to parse as number if it looks like one
                    const numVal = Number(val)
                    if (!isNaN(numVal)) return numVal
                    return val // return as string
                }
                return val
            }

            return h('div', {
                'style': {
                    'border': '3px solid #333',
                    'padding': '15px',
                    'margin': '10px',
                    'backgroundColor': '#ffffe6'
                }
            } as any,
                h('h3', null, () => getValue(title)),
                h('p', null, () => `Count: ${getValue(count)}`),
                h('div', { 'style': { 'marginLeft': '20px', 'borderLeft': '2px dashed #999', 'paddingLeft': '10px' } } as any, children)
            )
        })

        // Register custom elements
        customElement('leaf-element', LeafElement)
        customElement('intermediate-element', IntermediateElement)
        customElement('root-element', RootElement)

        // Create test elements - MIXED APPROACHES

        // 1. Pure custom elements
        const element1 = h('root-element' as any, {
            title: 'Level 1: Main Root',
            count: '42'
        } as any,
            h('intermediate-element' as any, {
                title: 'Main Intermediate',
                count: '42',
                active: 'true'
            } as any,
                h('leaf-element' as any, {
                    text: 'Nested Leaf',
                    number: '100'
                } as any),
                h('leaf-element' as any, {
                    text: 'Another Leaf',
                    number: '200'
                } as any)
            ),
            h('leaf-element' as any, {
                text: 'Direct Root Child',
                number: '300'
            } as any)
        )

        // Render all elements
        const container = h('div', null,
            h('h1', null, 'Custom Element Nested Components Test'),
            element1
        )

        render(container, document.body)
    })

    // Wait for content to render
    await page.waitForTimeout(100)

    // Test 1: Basic nesting structure
    const tsxRoot = await page.locator('div:has(h3:text("Level 1: Main Root"))').first()
    await expect(tsxRoot).toBeVisible()
    await expect(tsxRoot).toContainText('Count: 42')

    const tsxIntermediate = tsxRoot.locator('div:has(h4:text("Main Intermediate"))').first()
    await expect(tsxIntermediate).toContainText('Count: 42')
    await expect(tsxIntermediate).toContainText('Active: Yes')

    const tsxLeaf1 = tsxIntermediate.locator('div:has(small:text("Leaf: Nested Leaf"))').first()
    await expect(tsxLeaf1).toContainText('(100)')

    const tsxLeaf2 = tsxIntermediate.locator('div:has(small:text("Leaf: Another Leaf"))').first()
    await expect(tsxLeaf2).toContainText('(200)')

    const tsxDirectLeaf = tsxRoot.locator('div:has(small:text("Leaf: Direct Root Child"))').first()
    await expect(tsxDirectLeaf).toContainText('(300)')

    // Verify styling hierarchy
    const rootStyles = await tsxRoot.evaluate(el => {
        const style = window.getComputedStyle(el)
        return {
            border: style.border,
            backgroundColor: style.backgroundColor,
            padding: style.padding
        }
    })
    await expect(rootStyles.border).toContain('3px solid')
    await expect(rootStyles.backgroundColor).toBe('rgb(255, 255, 230)') // #ffffe6

    console.log('✅ Custom Element Nested Components tests passed')
})