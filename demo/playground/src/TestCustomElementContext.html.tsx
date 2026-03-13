/**
 * Test Custom Element Context
 * 
 * Tests context functionality in custom elements:
 * - Context provider/consumer patterns
 * - Context inheritance through custom elements
 * - Context value passing between TSX and custom elements
 * - Nested context providers
 */
import { $, $$, customElement, defaults, createContext, useContext, useMountedContext, HtmlString, HtmlNumber, type JSX, useEffect, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert, minimiseHtml } from './util'

// Create contexts
const ThemeContext = createContext('light')
const CounterContext = createContext(0)
const NestedContext = createContext('default')

// Hook for theme context
const useTheme = () => useMountedContext(ThemeContext)
const useCounter = () => useMountedContext(CounterContext)
const useNested = () => useMountedContext(NestedContext)

// Custom element that consumes context
const ContextConsumer = defaults(() => ({
    label: $('Consumer')
}), ({ label }) => {
    const theme = useTheme()
    const counter = useCounter()
    const nested = useNested()

    useEffect(() => {
        // useMountedContext returns an array-based observable
        // Access the value directly with $$()
        console.log('context theme=', $$(theme), 'counter=', $$(counter), 'nested=', $$(nested))
    })

    return (
        <div style={{
            border: '1px solid gray',
            padding: '8px',
            margin: '5px',
            backgroundColor: () => theme === 'dark' ? '#333' : '#fff',
            color: () => theme === 'dark' ? '#fff' : '#000'
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
    theme: $('light'),
    counter: $(0),
    nested: $('provider-value')
}), ({ theme, counter, nested, children }) => {
    return (
        <div style={{ border: '2px solid blue', padding: '10px', margin: '10px' }}>
            <h4>Context Provider (Theme: {$$(theme)}, Counter: {$$(counter)}</h4>
            <ThemeContext.Provider value={theme}>
                <CounterContext.Provider value={counter}>
                    <NestedContext.Provider value={nested}>
                        <div style={{ marginLeft: '20px' }}>
                            {children}
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
    const count = $(initialValue)
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
    const env = typeof window !== 'undefined' ? 'browser' : 'ssr'
    console.log(`[registerCustomElements] Environment: ${env}`)
    customElement('context-consumer', ContextConsumer)
    customElement('context-provider2', ContextProvider2)
    customElement('counter-element', CounterElement)
}



// Test component
const TestCustomElementContextHtml = (): JSX.Element => {
    const appTheme = 'dark'
    const appCounter = 100
    const appNested = 'app-level'

    const ret: JSX.Element = () => (
        <div dangerouslySetInnerHTML={{
            __html: `
            <h1>Custom Element Context Test in HTML</h1>

            <ThemeContext.Provider value={appTheme}>
                <CounterContext.Provider value={appCounter}>
                    <NestedContext.Provider value={appNested}>

                        <h2>1. Direct TSX Context Usage</h2>
                        <ContextConsumer label="Direct TSX Consumer" />
                        Custom element consuming context
                        <h2>2. Custom Element Context Consumption</h2>
                        <context-consumer label="HTML Custom Element Consumer" />

                        <h2>3. Context Provider Custom Element</h2>
                        <context-provider2
                            theme="dark"
                            counter="50"
                            nested="custom-provider"
                        >
                            <context-consumer label="Nested Consumer 1" />
                            <ContextConsumer label="Nested Consumer 2" />
                        </context-provider2>

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

                                <context-provider2 theme="dark" counter="999">
                                    <context-consumer label="Level 3 Consumer" />
                                </context-provider2>
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
            </ThemeContext.Provider>`}}>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable('TestCustomElementContext_ssr', ret)

    return ret
}

export const TestWrapper = () => {
    registerCustomElements()
    return () => <TestCustomElementContextHtml />
}

TestWrapper.test = {
    static: true,
    expect: () => {
        // Define expected HTML structure for context test
        const expected = minimiseHtml(`<div>
    <h1>Custom Element Context Test</h1>
    <h2>1. Direct TSX Context Usage</h2>
    <div
        style="border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);">
        <strong>Direct TSX Consumer:</strong>
        <ul>
            <li>Theme: dark</li>
            <li>Counter: 100</li>
            <li>Nested: app-level</li>
        </ul>
    </div>Custom element consuming context<h2>2. Custom Element Context Consumption</h2><context-consumer
        label="HTML Custom Element Consumer"></context-consumer>
    <h2>3. Context Provider Custom Element</h2><context-provider2 theme="dark" counter="50" nested="custom-provider">
        <div style="border: 2px solid blue; padding: 10px; margin: 10px;">
            <h4>Context Provider (Theme: light, Counter: 0</h4>
            <div style="margin-left: 20px;"><context-consumer label="Nested Consumer 1"></context-consumer>
                <div
                    style="border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);">
                    <strong>Nested Consumer 2:</strong>
                    <ul>
                        <li>Theme: dark</li>
                        <li>Counter: 50</li>
                        <li>Nested: custom-provider</li>
                    </ul>
                </div>
            </div>
        </div>
    </context-provider2>
    <h2>4. Counter Element with Context</h2><counter-element initial-value="10" title="HTML Counter Element">
        <div style="border: 2px solid green; padding: 15px; margin: 10px;">
            <h3>HTML Counter Element</h3>
            <p>Internal Count: 10</p><button>+</button><button>-</button>
            <div style="margin-top: 10px;"><context-consumer label="Counter Context Consumer"></context-consumer></div>
        </div>
    </counter-element>
    <h2>5. Complex Nested Context</h2>
    <div style="border: 2px solid blue; padding: 10px; margin: 10px;">
        <h4>Context Provider (Theme: light, Counter: 200</h4>
        <div style="margin-left: 20px;"><context-consumer label="Level 1 Consumer"></context-consumer><counter-element
                initial-value="5" title="Nested Counter">
                <div style="border: 2px solid green; padding: 15px; margin: 10px;">
                    <h3>Nested Counter</h3>
                    <p>Internal Count: 5</p><button>+</button><button>-</button>
                    <div style="margin-top: 10px;"><context-consumer
                            label="Level 2 Consumer"></context-consumer><context-provider2 theme="dark" counter="999">
                            <div style="border: 2px solid blue; padding: 10px; margin: 10px;">
                                <h4>Context Provider (Theme: light, Counter: 0</h4>
                                <div style="margin-left: 20px;"><context-consumer
                                        label="Level 3 Consumer"></context-consumer></div>
                            </div>
                        </context-provider2></div>
                </div>
            </counter-element></div>
    </div>
    <h2>6. Context Inheritance Test</h2>
    <div>
        <p>App-level context values:</p>
        <ul>
            <li>Theme: dark</li>
            <li>Counter: 100</li>
            <li>Nested: app-level</li>
        </ul>
        <div
            style="border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);">
            <strong>App-level Context Consumer:</strong>
            <ul>
                <li>Theme: dark</li>
                <li>Counter: 100</li>
                <li>Nested: app-level</li>
            </ul>
        </div>
    </div>
</div>`)

        // SSR test
        const ssrComponent = testObservables['TestCustomElementContext_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = expected

        if (ssrResult !== expectedFull) {
            assert(false, `[TestCustomElementContext] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestCustomElementContext] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default TestWrapper