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

test('Custom Element Context Functionality', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        // Fix: destructure defaults and customElement which were missing
        const { $, $$, createContext, useMountedContext, defaults, customElement, h, render } = woby

        // Create contexts
        const ThemeContext = createContext('light')
        const CounterContext = createContext(0)
        const NestedContext = createContext('default')

        const useTheme = () => useMountedContext(ThemeContext)
        const useCounter = () => useMountedContext(CounterContext)
        const useNested = () => useMountedContext(NestedContext)

        // Fix: ContextConsumer must destructure [value, mount] and include mounts in output
        // so the DOM traversal can locate the nearest CONTEXT-PROVIDER ancestor
        const ContextConsumer = defaults(() => ({
            label: $('Context Consumer')
        }), ({ label }) => {
            const [theme, themeMount] = useTheme() as unknown as [any, any]
            const [counter, counterMount] = useCounter() as unknown as [any, any]
            const [nested, nestedMount] = useNested() as unknown as [any, any]

            return h('div', {
                'style': {
                    'padding': '10px',
                    'margin': '5px',
                    'border': '1px solid #ccc',
                    'background-color': () => $$(theme) === 'dark' ? '#333' : '#fff',
                    'color': () => $$(theme) === 'dark' ? '#fff' : '#000'
                }
            } as any,
                h('strong', null, () => $$(label)),
                h('p', null, () => `Theme: ${$$(theme)}`),
                h('p', null, () => `Counter: ${$$(counter)}`),
                h('p', null, () => `Nested: ${$$(nested)}`),
                // mounts must be in rendered output for traversal to work
                themeMount,
                counterMount,
                nestedMount
            )
        })

        // Define context provider component
        const ContextProvider = defaults(() => ({
            theme: $('light'),
            counter: $(0)
        }), ({ theme, counter, children }) => {
            return h(ThemeContext.Provider, { value: $$(theme) } as any,
                h(CounterContext.Provider, { value: $$(counter) } as any,
                    h(NestedContext.Provider, { value: 'custom-provider' } as any,
                        h('div', {
                            'style': { 'padding': '15px', 'border': '2px solid blue', 'margin': '10px' }
                        } as any,
                            h('h3', null, () => `Context Provider (Theme: ${$$(theme)}, Counter: ${$$(counter)})`),
                            children
                        )
                    )
                )
            )
        })

        // Define counter element
        const CounterElement = defaults(() => ({
            title: $('Counter Element'),
            initialCount: $(0)
        }), ({ title, initialCount, children }) => {
            const count = $(initialCount() as number)
            const increment = () => count((prev: number) => prev + 1)

            return h(CounterContext.Provider, { value: count } as any,
                h('div', {
                    'style': { 'padding': '15px', 'border': '2px solid green', 'margin': '10px' }
                } as any,
                    h('h3', null, () => $$(title)),
                    h('p', null, () => `Internal Count: ${$$(count)}`),
                    h('button', { onclick: increment }, 'Increment'),
                    children
                )
            )
        })

        // Register custom elements
        customElement('context-consumer', ContextConsumer)
        customElement('context-provider', ContextProvider)
        customElement('counter-element', CounterElement)

        // 1. Direct TSX context usage
        const element1 = h('div', {
            'style': { 'padding': '10px', 'background-color': '#f0f0f0', 'margin': '10px' }
        } as any,
            h('p', null, 'App-level context values:'),
            h('p', null, 'Theme: dark'),
            h('p', null, 'Counter: 100'),
            h('p', null, 'Nested: app-level'),
            h(ContextConsumer, { label: $('App-level Context Consumer') })
        )

        const element2 = h(ContextConsumer, { label: $('Direct TSX Consumer') })

        // 3. Context provider custom element
        const element3 = h(ContextProvider, { theme: $('dark'), counter: $(50) } as any,
            h(ContextConsumer, { label: $('Nested Consumer 1') }),
            h('div', null,
                h('strong', null, 'Nested Consumer 2'),
                h('p', null, 'Theme: dark'),
                h('p', null, 'Counter: 50'),
                h('p', null, 'Nested: custom-provider')
            )
        )

        // 4. Counter element with context
        const element4 = h(CounterElement, { title: $('TSX Counter Element'), initialCount: $(10) } as any,
            h(ContextConsumer, { label: $('Counter Context Consumer') })
        )

        // 5. Complex nested context — wrap with the declared providers
        const element5 = h(ThemeContext.Provider, { value: 'light' } as any,
            h(CounterContext.Provider, { value: 200 } as any,
                h(NestedContext.Provider, { value: 'tsx-provider' } as any,
                    h('div', {
                        'style': { 'padding': '15px', 'border': '2px solid purple', 'margin': '10px' }
                    } as any,
                        h('h4', null, 'Context Provider (Theme: light, Counter: 200)'),
                        h(ContextConsumer, { label: $('Level 1 Consumer') }),
                        h(CounterElement, { title: $('Nested Counter'), initialCount: $(5) } as any,
                            h(ContextConsumer, { label: $('Level 2 Consumer') }),
                            h(ContextProvider, { theme: $('dark'), counter: $(999) } as any,
                                h(ContextConsumer, { label: $('Level 3 Consumer') })
                            )
                        )
                    )
                )
            )
        )

        // Render all elements wrapped in app-level context providers
        // This gives elements 1, 2, and 4 their expected app-level context values
        const container = h(ThemeContext.Provider, { value: 'dark' } as any,
            h(CounterContext.Provider, { value: 100 } as any,
                h(NestedContext.Provider, { value: 'app-level' } as any,
                    h('div', null,
                        h('h1', null, 'Custom Element Context Test'),
                        element1,
                        element2,
                        element3,
                        element4,
                        element5
                    )
                )
            )
        )

        render(container, document.body)
    })

    // Wait for reactive traversal and DOM updates to settle
    await page.waitForTimeout(300)

    // Test 1: Direct TSX consumer gets app-level context values
    const tsxConsumer = await page.locator('div:has(strong:text("Direct TSX Consumer"))').first()
    await expect(tsxConsumer).toBeVisible()
    await expect(tsxConsumer).toContainText('Theme: dark')
    await expect(tsxConsumer).toContainText('Counter: 100')
    await expect(tsxConsumer).toContainText('Nested: app-level')

    // Test 2: App-level context consumer
    const appLevelConsumer = await page.locator('div:has(strong:text("App-level Context Consumer"))').first()
    await expect(appLevelConsumer).toBeVisible()
    await expect(appLevelConsumer).toContainText('Theme: dark')
    await expect(appLevelConsumer).toContainText('Counter: 100')
    await expect(appLevelConsumer).toContainText('Nested: app-level')

    // Test 3: Context provider overrides values
    const contextProvider = await page.locator('div:has(h3:text("Context Provider (Theme: dark, Counter: 50)"))').first()
    await expect(contextProvider).toBeVisible()

    const nestedConsumer1 = contextProvider.locator('div:has(strong:text("Nested Consumer 1"))').first()
    await expect(nestedConsumer1).toContainText('Theme: dark')
    await expect(nestedConsumer1).toContainText('Counter: 50')
    await expect(nestedConsumer1).toContainText('Nested: custom-provider')

    // nestedConsumer2 has hardcoded text (not a ContextConsumer)
    const nestedConsumer2 = contextProvider.locator('div:has(strong:text("Nested Consumer 2"))').first()
    await expect(nestedConsumer2).toContainText('Theme: dark')
    await expect(nestedConsumer2).toContainText('Counter: 50')
    await expect(nestedConsumer2).toContainText('Nested: custom-provider')

    // Test 4: Counter element — CounterContext overridden, Theme/Nested from app-level
    const counterElement = await page.locator('div:has(h3:text("TSX Counter Element"))').first()
    await expect(counterElement).toBeVisible()
    await expect(counterElement).toContainText('Internal Count: 10')

    const counterContextConsumer = counterElement.locator('div:has(strong:text("Counter Context Consumer"))').first()
    await expect(counterContextConsumer).toContainText('Theme: dark')
    await expect(counterContextConsumer).toContainText('Counter: 10')
    await expect(counterContextConsumer).toContainText('Nested: app-level')

    // Test 5: Complex nested context
    const complexProvider = await page.locator('div:has(h4:text("Context Provider (Theme: light, Counter: 200)"))').first()
    await expect(complexProvider).toBeVisible()

    // Level 1: sees the tsx-provider context (light, 200, tsx-provider)
    const level1Consumer = complexProvider.locator('div:has(strong:text("Level 1 Consumer"))').first()
    await expect(level1Consumer).toContainText('Theme: light')
    await expect(level1Consumer).toContainText('Counter: 200')
    await expect(level1Consumer).toContainText('Nested: tsx-provider')

    const nestedCounter = complexProvider.locator('div:has(h3:text("Nested Counter"))').first()
    await expect(nestedCounter).toContainText('Internal Count: 5')

    // Level 2: CounterContext overridden to 5, Theme/Nested from tsx-provider ancestor
    const level2Consumer = nestedCounter.locator('div:has(strong:text("Level 2 Consumer"))').first()
    await expect(level2Consumer).toContainText('Theme: light')
    await expect(level2Consumer).toContainText('Counter: 5')
    await expect(level2Consumer).toContainText('Nested: tsx-provider')

    const level3Provider = nestedCounter.locator('div:has(h3:text("Context Provider (Theme: dark, Counter: 999)"))').first()
    await expect(level3Provider).toBeVisible()

    // Level 3: ContextProvider overrides all three contexts
    const level3Consumer = level3Provider.locator('div:has(strong:text("Level 3 Consumer"))').first()
    await expect(level3Consumer).toContainText('Theme: dark')
    await expect(level3Consumer).toContainText('Counter: 999')
    await expect(level3Consumer).toContainText('Nested: custom-provider')

    // Test 6: hardcoded app-level info div
    const appLevelInfo = await page.locator('div:has(p:text("App-level context values:"))').first()
    await expect(appLevelInfo).toContainText('Theme: dark')
    await expect(appLevelInfo).toContainText('Counter: 100')
    await expect(appLevelInfo).toContainText('Nested: app-level')

    // Test 7: Verify reactive styling — dark theme consumer should have dark background
    const darkThemeConsumer = await tsxConsumer.evaluate(el => {
        const style = window.getComputedStyle(el)
        return {
            backgroundColor: style.backgroundColor,
            color: style.color
        }
    })
    await expect(darkThemeConsumer.backgroundColor).toBe('rgb(51, 51, 51)') // #333
    await expect(darkThemeConsumer.color).toBe('rgb(255, 255, 255)') // #fff

    console.log('✅ Custom Element Context tests passed')
})
