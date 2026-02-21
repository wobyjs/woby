import test from '@playwright/test'
import expect from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type Woby from '../../../../src'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('Custom Element Basic Functionality', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, defaults, customElement, h, render } = woby

        // Define and register custom elements
        const BasicElement = defaults(() => ({
            title: $('Basic Element'),
            count: $(0),
            active: $(false),
            color: $('blue')
        }), ({ title, count, active, color, children }) => {
            // Helper to handle both observable and raw values
            const getValue = (val) => {
                if (typeof val === 'function') {
                    return val() // it's an observable
                } else if (typeof val === 'string') {
                    // Convert string representations to appropriate types
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
                    'border': '2px solid ' + getValue(color),
                    'padding': '10px',
                    'background-color': getValue(active) ? '#e0e0e0' : 'white'
                }
            } as any,
                h('h2', null, () => getValue(title)),
                h('p', null, () => `Count: ${getValue(count)}`),
                h('p', null, () => `Active: ${getValue(active) ? 'Yes' : 'No'}`),
                h('div', null, children)
            )
        })

        // Register the custom element
        customElement('basic-element', BasicElement)

        // Create test elements - MIXED APPROACHES

        // 1. TSX Component usage (h(BasicElement, ...))
        const element1 = h(BasicElement, {
            title: $('Test Element'),
            count: $(42),
            active: $(true),
            color: $('green')
        },
            h('p', null, 'This is child content from TSX')
        )

        // 2. Custom Element usage - using component function
        const element2 = h(BasicElement, {
            title: $('HTML Attribute Title'),
            count: $(100),
            active: $(true),
            color: $('red')
        },
            h('p', null, 'This is child content from HTML - goes into slot')
        )

        // 3. Mixed usage - TSX component containing another component
        const element3 = h(BasicElement, { title: $('Mixed TSX') },
            h(BasicElement, { title: $('Nested Custom Element'), count: $(50) },
                h('p', null, 'Nested content - goes into nested slot')
            )
        )

        // Render all elements
        const container = h('div', null,
            h('h1', null, 'Custom Element Basic Test'),
            element1,
            element2,
            element3
        )

        render(container, document.body)
    })

    // Wait for content to render
    await page.waitForTimeout(100)

    // Test 1: TSX Component usage
    const tsxElement = await page.locator('div:has(h2:text("Test Element"))').first()
    await expect(tsxElement).toBeVisible()
    await expect(tsxElement).toContainText('Count: 42')
    await expect(tsxElement).toContainText('Active: Yes')
    await expect(tsxElement).toContainText('This is child content from TSX')

    // Test 2: Custom Element Component usage
    const componentElement = await page.locator('div:has(h2:text("HTML Attribute Title"))').first()
    await expect(componentElement).toBeVisible()
    await expect(componentElement).toContainText('Count: 100')
    await expect(componentElement).toContainText('Active: Yes')
    await expect(componentElement).toContainText('This is child content from HTML - goes into slot')

    // Test 3: Mixed usage
    const mixedElement = await page.locator('div:has(h2:text("Mixed TSX"))').first()
    await expect(mixedElement).toBeVisible()
    await expect(mixedElement).toContainText('Nested Custom Element')
    const nestedElement = await mixedElement.locator('div:has(h2:text("Nested Custom Element"))').first()
    await expect(nestedElement).toBeVisible()
    await expect(nestedElement).toContainText('Count: 50')

    // Test style properties
    const styledElement = await page.locator('div:has(h2:text("HTML Attribute Title"))').first()
    const hasRedBorder = await styledElement.evaluate(el => {
        return el.style.border.includes('red') || el.style.borderColor === 'red'
    })
    await expect(hasRedBorder).toBe(true)

    const backgroundColor = await styledElement.evaluate(el => {
        const style = window.getComputedStyle(el)
        return style.backgroundColor
    })
    await expect(backgroundColor).toBe('rgb(224, 224, 224)')

    console.log('✅ Custom Element Basic tests passed')
})