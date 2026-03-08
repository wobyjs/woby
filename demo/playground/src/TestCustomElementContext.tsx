/**
 * Test Custom Element Context
 * 
 * Tests context functionality in custom elements:
 * - Context provider/consumer patterns
 * - Context inheritance through custom elements
 * - Context value passing between TSX and custom elements
 * - Nested context providers
 */
import { $, $$, customElement, defaults, createContext, useContext, useMountedContext, HtmlString, HtmlNumber, type JSX } from 'woby'

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

    return (
        <div style={{
            border: '1px solid gray',
            padding: '8px',
            margin: '5px',
            backgroundColor: $$(theme) === 'dark' ? '#333' : '#fff',
            color: $$(theme) === 'dark' ? '#fff' : '#000'
        }}>
            <strong>{$$(label)}:</strong>
            <ul>
                <li>Theme: {$$(theme)}</li>
                <li>Counter: {$$(counter)}</li>
                <li>Nested: {$$(nested)}</li>
            </ul>
        </div>
    )
})

// Custom element that provides context
const ContextProvider = defaults(() => ({
    theme: $('light'),
    counter: $(0),
    nested: $('provider-value')
}), ({ theme, counter, nested, children }) => {
    return (
        <div style={{ border: '2px solid blue', padding: '10px', margin: '10px' }}>
            <h4>Context Provider (Theme: {$$(theme)}, Counter: {$$(counter)})</h4>
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
            <h3>{$$(title)}</h3>
            <p>Internal Count: {$$(count)}</p>
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
    customElement('context-provider', ContextProvider)
    customElement('counter-element', CounterElement)
}

const TestWrapper = () => {
    registerCustomElements()
    return <TestCustomElementContext />
}

export default TestWrapper

// Test component
const TestCustomElementContext = () => {
    const appTheme = $('dark')
    const appCounter = $(100)
    const appNested = $('app-level')

    return (
        <div>
            <h1>Custom Element Context Test</h1>

            {/* App-level context providers */}
            <ThemeContext.Provider value={appTheme}>
                <CounterContext.Provider value={appCounter}>
                    <NestedContext.Provider value={appNested}>

                        {/* Direct TSX usage */}
                        <h2>1. Direct TSX Context Usage</h2>
                        <ContextConsumer label="Direct TSX Consumer" />

                        {/* Custom element consuming context */}
                        <h2>2. Custom Element Context Consumption</h2>
                        <context-consumer label="HTML Custom Element Consumer" />

                        {/* Context provider custom element */}
                        <h2>3. Context Provider Custom Element</h2>
                        <context-provider
                            theme="dark"
                            counter="50"
                            nested="custom-provider"
                        >
                            <context-consumer label="Nested Consumer 1" />
                            <ContextConsumer label="Nested Consumer 2" />
                        </context-provider>

                        {/* Counter element with context */}
                        <h2>4. Counter Element with Context</h2>
                        <counter-element
                            initial-value="10"
                            title="HTML Counter Element"
                        >
                            <context-consumer label="Counter Context Consumer" />
                        </counter-element>

                        {/* Mixed nested usage */}
                        <h2>5. Complex Nested Context</h2>
                        <ContextProvider
                            theme="light"
                            counter={200}
                            nested="tsx-provider"
                        >
                            <context-consumer label="Level 1 Consumer" />

                            <counter-element initial-value="5" title="Nested Counter">
                                <context-consumer label="Level 2 Consumer" />

                                <context-provider theme="dark" counter="999">
                                    <context-consumer label="Level 3 Consumer" />
                                </context-provider>
                            </counter-element>
                        </ContextProvider>

                        {/* Context inheritance test */}
                        <h2>6. Context Inheritance Test</h2>
                        <div>
                            <p>App-level context values:</p>
                            <ul>
                                <li>Theme: {$$(appTheme)}</li>
                                <li>Counter: {$$(appCounter)}</li>
                                <li>Nested: {$$(appNested)}</li>
                            </ul>

                            <ContextConsumer label="App-level Context Consumer" />
                        </div>

                    </NestedContext.Provider>
                </CounterContext.Provider>
            </ThemeContext.Provider>
        </div>
    )
}