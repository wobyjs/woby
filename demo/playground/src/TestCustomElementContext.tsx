/**
 * Test Custom Element Context
 * 
 * Tests context functionality in custom elements:
 * - Context provider/consumer patterns
 * - Context inheritance through custom elements
 * - Context value passing between TSX and custom elements
 * - Nested context providers
 */
import { $, $$, customElement, defaults, createContext, useContext, HtmlString, HtmlNumber, type JSX, useEffect, renderToString, type ElementAttributes } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert, minimiseHtml } from './util'

// TypeScript type augmentation for custom elements
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'context-consumer': ElementAttributes<typeof ContextConsumer>
            'context-provider3': ElementAttributes<typeof ContextProvider2>
            'counter-element': ElementAttributes<typeof CounterElement>
        }
    }
}

// Create contexts
const ThemeContext = createContext('light')
const CounterContext = createContext(0)
const NestedContext = createContext('default')

// Hook for theme context
const useTheme = () => useContext(ThemeContext)
const useCounter = () => useContext(CounterContext)
const useNested = () => useContext(NestedContext)

// Custom element that consumes context
const ContextConsumer = defaults(() => ({
    label: $('Consumer')
}), ({ label }) => {
    const theme = useTheme()
    const counter = useCounter()
    const nested = useNested()

    return (
        <div style={{
            border: '1px solid gray',
            padding: '8px',
            margin: '5px',
            backgroundColor: () => $$(theme) === 'dark' ? '#333' : '#fff',
            color: () => $$(theme) === 'dark' ? '#fff' : '#000'
        }}>
            <strong>{label}:</strong>
            <ul>
                <li>Theme: {theme}</li>
                <li>Counter: {counter}</li>
                <li>Nested: {nested}</li>
            </ul>
        </div>
    )
})

// Custom element that provides context
const ContextProvider2 = defaults(() => ({
    theme: $('light', HtmlString),
    counter: $(0, HtmlNumber),
    nested: $('provider-value', HtmlString)
}), ({ theme, counter, nested, children }) => {
    return (
        <div style={{ border: '2px solid blue', padding: '10px', margin: '10px' }}>
            <h4>Context Provider (Theme: {$$(theme)}, Counter: {$$(counter)}</h4>
            {/* First child position - before providers */}
            <span data-test="before-providers">Before providers</span>

            <ThemeContext.Provider value={theme}>
                {/* Middle child - between providers */}
                <span data-test="between-providers">Between providers</span>

                <CounterContext.Provider value={counter}>
                    <NestedContext.Provider value={nested}>
                        <div style={{ marginLeft: '20px' }}>
                            {/* Last child in nested provider */}
                            {children}
                            {/* Additional content after children */}
                            <span data-test="after-children">After children</span>
                        </div>
                    </NestedContext.Provider>
                </CounterContext.Provider>
            </ThemeContext.Provider>
        </div>
    )
})

// Custom element with internal context management
const CounterElement = defaults(() => ({
    initialValue: $(0, HtmlNumber),
    title: $('Counter Element', HtmlString)
}), ({ initialValue, title, children }) => {
    const count = $(initialValue, HtmlNumber)
    const increment = () => count($$(count) + 1)
    const decrement = () => count($$(count) - 1)

    return (
        <div style={{ border: '2px solid green', padding: '15px', margin: '10px' }}>
            <h3>{title}</h3>
            <p>Internal Count: {count}</p>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>

            {/* Provide this element's count as context */}
            <CounterContext.Provider value={count}>
                <div style={{ marginTop: '10px' }}>
                    {children}
                </div>
            </CounterContext.Provider>
        </div>
    )
})

// Register custom elements inside render context
const registerCustomElements = (): void => {
    customElement('context-consumer', ContextConsumer)
    customElement('context-provider3', ContextProvider2)
    customElement('counter-element', CounterElement)
}



// Test component
const name = 'TestCustomElementContext'
const TestCustomElementContext = (): JSX.Element => {
    const appTheme = 'dark'
    const appCounter = 100
    const appNested = 'app-level'

    const ret: JSX.Element = () => (
        <div>
            <h1>Custom Element Context Test</h1>

            <ThemeContext.Provider value={appTheme}>
                <CounterContext.Provider value={appCounter}>
                    <NestedContext.Provider value={appNested}>

                        <h2>1. Direct TSX Context Usage</h2>
                        <ContextConsumer label="Direct TSX Consumer" />
                        Custom element consuming context
                        <h2>2. Custom Element Context Consumption</h2>
                        <context-consumer label="HTML Custom Element Consumer" />

                        <h2>3. Context Provider Custom Element</h2>
                        <context-provider3
                            theme="dark"
                            counter="50"
                            nested="custom-provider"
                        >
                            <context-consumer label="Nested Consumer 1" />
                            <ContextConsumer label="Nested Consumer 2" />
                        </context-provider3>

                        <h2>4. Counter Element with Context</h2>
                        <counter-element
                            initial-value="10"
                            title="HTML Counter Element"
                        >
                            <context-consumer label="Counter Context Consumer" />
                        </counter-element>

                        <h2>5. Complex Nested Context</h2>
                        <ContextProvider2
                            theme="light"
                            counter={200}
                            nested="tsx-provider"
                        >
                            <context-consumer label="Level 1 Consumer" />

                            <counter-element initial-value="5" title="Nested Counter">
                                <context-consumer label="Level 2 Consumer" />

                                <context-provider3 theme="dark" counter="999">
                                    <context-consumer label="Level 3 Consumer" />
                                </context-provider3>
                            </counter-element>
                        </ContextProvider2>

                        <h2>6. Context Inheritance Test</h2>
                        <div>
                            <p>App-level context values:</p>
                            <ul>
                                <li>Theme: {appTheme}</li>
                                <li>Counter: {appCounter}</li>
                                <li>Nested: {appNested}</li>
                            </ul>

                            <ContextConsumer label="App-level Context Consumer" />
                        </div>

                    </NestedContext.Provider>
                </CounterContext.Provider>
            </ThemeContext.Provider>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    registerCustomElements()
    const ssrResult = renderToString(<TestCustomElementContext />)
    console.log(`\n📝 Test: TestCustomElementContext\n   SSR: ${ssrResult.substring(0, 150)}... ✅\n`)
}

TestCustomElementContext.test = {
    // Not static: custom-element context consumers resolve context only after
    // they are connected to the DOM (a child is constructed before its parent
    // provider exists — woby renders bottom-up, so context resolves top-down on
    // connect). That legitimately mutates the light DOM once after initial mount.
    static: false,
    compareActualValues: true,
    expect: () => {
        // DOM expectation: in the browser, custom elements render their content
        // inline (light DOM, no shadow root) and context propagates through the
        // native custom-element context path — theme/counter/nested all resolve
        // to the correct provider values at every nesting level.
        const expected = "<div><h1>Custom Element Context Test</h1><h2>1. Direct TSX Context Usage</h2><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>Direct TSX Consumer:</strong><ul><li>Theme: dark</li><li>Counter: 100</li><li>Nested: app-level</li></ul></div>Custom element consuming context<h2>2. Custom Element Context Consumption</h2><context-consumer label=\"HTML Custom Element Consumer\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>HTML Custom Element Consumer:</strong><ul><li>Theme: dark</li><li>Counter: 100</li><li>Nested: app-level</li></ul></div></context-consumer><h2>3. Context Provider Custom Element</h2><context-provider3 theme=\"dark\" counter=\"50\" nested=\"custom-provider\"><div style=\"border: 2px solid blue; padding: 10px; margin: 10px;\"><h4>Context Provider (Theme: dark, Counter: 50</h4><span data-test=\"before-providers\">Before providers</span><span data-test=\"between-providers\">Between providers</span><div style=\"margin-left: 20px;\"><context-consumer label=\"Nested Consumer 1\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>Nested Consumer 1:</strong><ul><li>Theme: dark</li><li>Counter: 50</li><li>Nested: custom-provider</li></ul></div></context-consumer><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>Nested Consumer 2:</strong><ul><li>Theme: dark</li><li>Counter: 50</li><li>Nested: custom-provider</li></ul></div><span data-test=\"after-children\">After children</span></div></div></context-provider3><h2>4. Counter Element with Context</h2><counter-element initial-value=\"10\" title=\"HTML Counter Element\"><div style=\"border: 2px solid green; padding: 15px; margin: 10px;\"><p>Internal Count: 10</p><button>+</button><button>-</button><div style=\"margin-top: 10px;\"><context-consumer label=\"Counter Context Consumer\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>Counter Context Consumer:</strong><ul><li>Theme: dark</li><li>Counter: 10</li><li>Nested: app-level</li></ul></div></context-consumer></div></div></counter-element><h2>5. Complex Nested Context</h2><div style=\"border: 2px solid blue; padding: 10px; margin: 10px;\"><h4>Context Provider (Theme: light, Counter: 200</h4><span data-test=\"before-providers\">Before providers</span><span data-test=\"between-providers\">Between providers</span><div style=\"margin-left: 20px;\"><context-consumer label=\"Level 1 Consumer\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\"><strong>Level 1 Consumer:</strong><ul><li>Theme: light</li><li>Counter: 200</li><li>Nested: tsx-provider</li></ul></div></context-consumer><counter-element initial-value=\"5\" title=\"Nested Counter\"><div style=\"border: 2px solid green; padding: 15px; margin: 10px;\"><h3>Nested Counter</h3><p>Internal Count: 5</p><button>+</button><button>-</button><div style=\"margin-top: 10px;\"><context-consumer label=\"Level 2 Consumer\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\"><strong>Level 2 Consumer:</strong><ul><li>Theme: light</li><li>Counter: 5</li><li>Nested: tsx-provider</li></ul></div></context-consumer><context-provider3 theme=\"dark\" counter=\"999\" nested=\"provider-value\"><div style=\"border: 2px solid blue; padding: 10px; margin: 10px;\"><h4>Context Provider (Theme: dark, Counter: 999</h4><span data-test=\"before-providers\">Before providers</span><span data-test=\"between-providers\">Between providers</span><div style=\"margin-left: 20px;\"><context-consumer label=\"Level 3 Consumer\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>Level 3 Consumer:</strong><ul><li>Theme: dark</li><li>Counter: 999</li><li>Nested: provider-value</li></ul></div></context-consumer><span data-test=\"after-children\">After children</span></div></div></context-provider3></div></div></counter-element><span data-test=\"after-children\">After children</span></div></div><h2>6. Context Inheritance Test</h2><div><p>App-level context values:</p><ul><li>Theme: dark</li><li>Counter: 100</li><li>Nested: app-level</li></ul><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>App-level Context Consumer:</strong><ul><li>Theme: dark</li><li>Counter: 100</li><li>Nested: app-level</li></ul></div></div></div>"

        // SSR expectation: renderToString does NOT run the custom-element connect
        // lifecycle, so light-DOM custom elements serialize as empty tags and
        // context does not propagate through them (inner TSX consumers fall back
        // to the app-level context). This mirrors the Basic test's SSR vs DOM
        // divergence — a single string cannot satisfy both paths.
        const expectedFull = "<div><h1>Custom Element Context Test</h1><h2>1. Direct TSX Context Usage</h2><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: #333; color: #fff;\"><strong>Direct TSX Consumer:</strong><ul><li>Theme: dark</li><li>Counter: 100</li><li>Nested: app-level</li></ul></div>Custom element consuming context<h2>2. Custom Element Context Consumption</h2><context-consumer label=\"HTML Custom Element Consumer\"></context-consumer><h2>3. Context Provider Custom Element</h2><context-provider3 theme=\"dark\" counter=\"50\" nested=\"custom-provider\"><context-consumer label=\"Nested Consumer 1\"></context-consumer><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: #333; color: #fff;\"><strong>Nested Consumer 2:</strong><ul><li>Theme: dark</li><li>Counter: 100</li><li>Nested: app-level</li></ul></div></context-provider3><h2>4. Counter Element with Context</h2><counter-element initial-value=\"10\" title=\"HTML Counter Element\"><context-consumer label=\"Counter Context Consumer\"></context-consumer></counter-element><h2>5. Complex Nested Context</h2><div style=\"border: 2px solid blue; padding: 10px; margin: 10px;\"><h4>Context Provider (Theme: light, Counter: 200</h4><span data-test=\"before-providers\">Before providers</span><span data-test=\"between-providers\">Between providers</span><div style=\"margin-left: 20px;\"><context-consumer label=\"Level 1 Consumer\"></context-consumer><counter-element initial-value=\"5\" title=\"Nested Counter\"><context-consumer label=\"Level 2 Consumer\"></context-consumer><context-provider3 theme=\"dark\" counter=\"999\"><context-consumer label=\"Level 3 Consumer\"></context-consumer></context-provider3></counter-element></div></div><h2>6. Context Inheritance Test</h2><div><p>App-level context values:</p><ul><li>Theme: dark</li><li>Counter: 100</li><li>Nested: app-level</li></ul><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: #333; color: #fff;\"><strong>App-level Context Consumer:</strong><ul><li>Theme: dark</li><li>Counter: 100</li><li>Nested: app-level</li></ul></div></div></div>"

        // SSR test
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)

        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

// The default export must run the test through TestSnapshots (which reads
// Component.test and renders Component into a ref'd div for DOM comparison).
// Register the custom elements first, then hand TestCustomElementContext —
// the component that carries `.test` — to TestSnapshots.
export default () => {
    registerCustomElements()
    return <TestSnapshots Component={TestCustomElementContext} />
}