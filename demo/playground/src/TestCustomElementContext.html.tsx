/**
 * Test Custom Element Context
 * 
 * Tests context functionality in custom elements:
 * - Context provider/consumer patterns
 * - Context inheritance through custom elements
 * - Context value passing between TSX and custom elements
 * - Nested context providers
 */
import { $, $$, customElement, defaults, createContext, useContext, HtmlString, HtmlNumber, type JSX, useEffect, renderToString } from 'woby'
import { TestSnapshots, useInterval, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert, minimiseHtml } from './util'

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
            // useContext returns an observable — must $$()-unwrap for logic comparisons
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
    customElement('context-consumer2', ContextConsumer)
    customElement('context-provider2', ContextProvider2)
    customElement('counter-element2', CounterElement)
    // Raw context providers, registered so the app-level context can be
    // established from raw HTML (JSX <Context.Provider> is not valid HTML).
    customElement('theme-ctx', ThemeContext.Provider)
    customElement('counter-ctx', CounterContext.Provider)
    customElement('nested-ctx', NestedContext.Provider)
}



// Test component
const name = 'TestCustomElementContextHtml'
const TestCustomElementContextHtml = (): JSX.Element => {
    // Force one benign light-DOM mutation after mount so TestSnapshots sees a
    // second tick (static:false requires ticks>1). This adds a data-mutated
    // attribute on the outer provider host; it does NOT change any resolved
    // context value, so the consumer content is identical before and after.
    useTimeout(() => {
        const el = document.querySelector('theme-ctx')
        if (el) el.setAttribute('data-mutated', '1')
    }, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <div dangerouslySetInnerHTML={{
            __html: `
            <h1>Custom Element Context Test in HTML</h1>
            <theme-ctx value="dark"><counter-ctx value="100"><nested-ctx value="app-level">

                <h2>1. Direct Context Consumption</h2>
                <context-consumer2 label="Direct Consumer"></context-consumer2>

                <h2>2. Context Provider Custom Element</h2>
                <context-provider2 theme="dark" counter="50" nested="custom-provider">
                    <context-consumer2 label="Nested Consumer 1"></context-consumer2>
                </context-provider2>

                <h2>3. Counter Element with Context</h2>
                <counter-element2 initial-value="10" title="HTML Counter Element">
                    <context-consumer2 label="Counter Context Consumer"></context-consumer2>
                </counter-element2>

                <h2>4. Complex Nested Context</h2>
                <context-provider2 theme="light" counter="200" nested="tsx-provider">
                    <context-consumer2 label="Level 1 Consumer"></context-consumer2>
                    <counter-element2 initial-value="5" title="Nested Counter">
                        <context-consumer2 label="Level 2 Consumer"></context-consumer2>
                        <context-provider2 theme="dark" counter="999" nested="provider-value">
                            <context-consumer2 label="Level 3 Consumer"></context-consumer2>
                        </context-provider2>
                    </counter-element2>
                </context-provider2>

            </nested-ctx></counter-ctx></theme-ctx>`}}>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestCustomElementContextHtml.test = {
    // static:false — raw-HTML custom-element context consumers resolve context on
    // connect (woby renders bottom-up: a slotted child constructs before its parent
    // provider's SYMBOL_CONTEXT_WRAP exists). The useTimeout above forces one benign
    // light-DOM mutation so TestSnapshots observes the required second tick.
    static: false,
    compareActualValues: true,
    expect: () => {
        // SSR does NOT run the connect lifecycle, so custom elements serialize as
        // empty tags and context does not propagate through them. This is the raw
        // initial-HTML shape (same divergence as the Basic test).
        const expectedFull = "<div><h1>Custom Element Context Test in HTML</h1><theme-ctx value=\"dark\"><counter-ctx value=\"100\"><nested-ctx value=\"app-level\"><h2>1. Direct Context Consumption</h2><context-consumer2 label=\"Direct Consumer\"></context-consumer2><h2>2. Context Provider Custom Element</h2><context-provider2 theme=\"dark\" counter=\"50\" nested=\"custom-provider\"><context-consumer2 label=\"Nested Consumer 1\"></context-consumer2></context-provider2><h2>3. Counter Element with Context</h2><counter-element2 initial-value=\"10\" title=\"HTML Counter Element\"><context-consumer2 label=\"Counter Context Consumer\"></context-consumer2></counter-element2><h2>4. Complex Nested Context</h2><context-provider2 theme=\"light\" counter=\"200\" nested=\"tsx-provider\"><context-consumer2 label=\"Level 1 Consumer\"></context-consumer2><counter-element2 initial-value=\"5\" title=\"Nested Counter\"><context-consumer2 label=\"Level 2 Consumer\"></context-consumer2><context-provider2 theme=\"dark\" counter=\"999\" nested=\"provider-value\"><context-consumer2 label=\"Level 3 Consumer\"></context-consumer2></context-provider2></counter-element2></context-provider2></nested-ctx></counter-ctx></theme-ctx></div>"

        // Browser DOM: every consumer resolves context through the DOM-walk bridge
        // (collectAncestorContextWrap) — including through defaults() components whose
        // internal JSX <Context.Provider>s now expose a composed SYMBOL_CONTEXT_WRAP.
        // Two accepted states: before (initial) and after (the benign data-mutated
        // attribute); resolved context content is identical in both.
        const before = "<div><h1>Custom Element Context Test in HTML</h1><theme-ctx value=\"dark\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><context-provider value=\"dark\"><slot><counter-ctx value=\"100\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><context-provider value=\"100\"><slot><nested-ctx value=\"app-level\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><context-provider value=\"app-level\"><slot><h2>1. Direct Context Consumption</h2><context-consumer2 label=\"Direct Consumer\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>Direct Consumer:</strong><ul><li>Theme: dark</li><li>Counter: 100</li><li>Nested: app-level</li></ul></div></template></context-consumer2><h2>2. Context Provider Custom Element</h2><context-provider2 theme=\"dark\" counter=\"50\" nested=\"custom-provider\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 2px solid blue; padding: 10px; margin: 10px;\"><h4>Context Provider (Theme: dark, Counter: 50</h4><div style=\"margin-left: 20px;\"><slot><context-consumer2 label=\"Nested Consumer 1\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>Nested Consumer 1:</strong><ul><li>Theme: dark</li><li>Counter: 50</li><li>Nested: custom-provider</li></ul></div></template></context-consumer2></slot></div></div></template></context-provider2><h2>3. Counter Element with Context</h2><counter-element2 initial-value=\"10\" title=\"HTML Counter Element\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 2px solid green; padding: 15px; margin: 10px;\"><p>Internal Count: 10</p><button>+</button><button>-</button><div style=\"margin-top: 10px;\"><slot><context-consumer2 label=\"Counter Context Consumer\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>Counter Context Consumer:</strong><ul><li>Theme: dark</li><li>Counter: 10</li><li>Nested: app-level</li></ul></div></template></context-consumer2></slot></div></div></template></counter-element2><h2>4. Complex Nested Context</h2><context-provider2 theme=\"light\" counter=\"200\" nested=\"tsx-provider\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 2px solid blue; padding: 10px; margin: 10px;\"><h4>Context Provider (Theme: light, Counter: 200</h4><div style=\"margin-left: 20px;\"><slot><context-consumer2 label=\"Level 1 Consumer\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\"><strong>Level 1 Consumer:</strong><ul><li>Theme: light</li><li>Counter: 200</li><li>Nested: tsx-provider</li></ul></div></template></context-consumer2><counter-element2 initial-value=\"5\" title=\"Nested Counter\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 2px solid green; padding: 15px; margin: 10px;\"><h3>Nested Counter</h3><p>Internal Count: 5</p><button>+</button><button>-</button><div style=\"margin-top: 10px;\"><slot><context-consumer2 label=\"Level 2 Consumer\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\"><strong>Level 2 Consumer:</strong><ul><li>Theme: light</li><li>Counter: 5</li><li>Nested: tsx-provider</li></ul></div></template></context-consumer2><context-provider2 theme=\"dark\" counter=\"999\" nested=\"provider-value\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 2px solid blue; padding: 10px; margin: 10px;\"><h4>Context Provider (Theme: dark, Counter: 999</h4><div style=\"margin-left: 20px;\"><slot><context-consumer2 label=\"Level 3 Consumer\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>Level 3 Consumer:</strong><ul><li>Theme: dark</li><li>Counter: 999</li><li>Nested: provider-value</li></ul></div></template></context-consumer2></slot></div></div></template></context-provider2></slot></div></div></template></counter-element2></slot></div></div></template></context-provider2></slot></context-provider></template></nested-ctx></slot></context-provider></template></counter-ctx></slot></context-provider></template></theme-ctx></div>"
        const after = "<div><h1>Custom Element Context Test in HTML</h1><theme-ctx value=\"dark\" data-mutated=\"1\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><context-provider value=\"dark\"><slot><counter-ctx value=\"100\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><context-provider value=\"100\"><slot><nested-ctx value=\"app-level\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><context-provider value=\"app-level\"><slot><h2>1. Direct Context Consumption</h2><context-consumer2 label=\"Direct Consumer\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>Direct Consumer:</strong><ul><li>Theme: dark</li><li>Counter: 100</li><li>Nested: app-level</li></ul></div></template></context-consumer2><h2>2. Context Provider Custom Element</h2><context-provider2 theme=\"dark\" counter=\"50\" nested=\"custom-provider\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 2px solid blue; padding: 10px; margin: 10px;\"><h4>Context Provider (Theme: dark, Counter: 50</h4><div style=\"margin-left: 20px;\"><slot><context-consumer2 label=\"Nested Consumer 1\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>Nested Consumer 1:</strong><ul><li>Theme: dark</li><li>Counter: 50</li><li>Nested: custom-provider</li></ul></div></template></context-consumer2></slot></div></div></template></context-provider2><h2>3. Counter Element with Context</h2><counter-element2 initial-value=\"10\" title=\"HTML Counter Element\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 2px solid green; padding: 15px; margin: 10px;\"><p>Internal Count: 10</p><button>+</button><button>-</button><div style=\"margin-top: 10px;\"><slot><context-consumer2 label=\"Counter Context Consumer\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>Counter Context Consumer:</strong><ul><li>Theme: dark</li><li>Counter: 10</li><li>Nested: app-level</li></ul></div></template></context-consumer2></slot></div></div></template></counter-element2><h2>4. Complex Nested Context</h2><context-provider2 theme=\"light\" counter=\"200\" nested=\"tsx-provider\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 2px solid blue; padding: 10px; margin: 10px;\"><h4>Context Provider (Theme: light, Counter: 200</h4><div style=\"margin-left: 20px;\"><slot><context-consumer2 label=\"Level 1 Consumer\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\"><strong>Level 1 Consumer:</strong><ul><li>Theme: light</li><li>Counter: 200</li><li>Nested: tsx-provider</li></ul></div></template></context-consumer2><counter-element2 initial-value=\"5\" title=\"Nested Counter\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 2px solid green; padding: 15px; margin: 10px;\"><h3>Nested Counter</h3><p>Internal Count: 5</p><button>+</button><button>-</button><div style=\"margin-top: 10px;\"><slot><context-consumer2 label=\"Level 2 Consumer\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\"><strong>Level 2 Consumer:</strong><ul><li>Theme: light</li><li>Counter: 5</li><li>Nested: tsx-provider</li></ul></div></template></context-consumer2><context-provider2 theme=\"dark\" counter=\"999\" nested=\"provider-value\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 2px solid blue; padding: 10px; margin: 10px;\"><h4>Context Provider (Theme: dark, Counter: 999</h4><div style=\"margin-left: 20px;\"><slot><context-consumer2 label=\"Level 3 Consumer\"><template shadowrootmode=\"open\" shadowrootserializable=\"\"><div style=\"border: 1px solid gray; padding: 8px; margin: 5px; background-color: rgb(51, 51, 51); color: rgb(255, 255, 255);\"><strong>Level 3 Consumer:</strong><ul><li>Theme: dark</li><li>Counter: 999</li><li>Nested: provider-value</li></ul></div></template></context-consumer2></slot></div></div></template></context-provider2></slot></div></div></template></counter-element2></slot></div></div></template></context-provider2></slot></context-provider></template></nested-ctx></slot></context-provider></template></counter-ctx></slot></context-provider></template></theme-ctx></div>"

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = minimiseHtml(renderToString(ssrComponent))
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return [before, after]
    }
}

// The default export must run the test through TestSnapshots so .test is consumed.
export default () => {
    registerCustomElements()
    return <TestSnapshots Component={TestCustomElementContextHtml} />
}
