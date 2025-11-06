/**
 * Counter Component Demo
 * 
 * This is a demonstration of creating a custom element with the Woby framework
 * that showcases reactive properties, nested properties, and style attributes.
 * 
 * The demo illustrates several important concepts:
 * 1. Custom element creation with proper defaults
 * 2. HTML attribute serialization using toHtml and fromHtml options
 * 3. Function storage in observables using array notation
 * 4. Object and Date serialization
 * 5. Context usage in custom elements
 * 6. Differences between HTML and JSX usage of custom elements
 * 
 * @file index.tsx
 */

/* IMPORT */
import { $, $$, useMemo, customElement, DEBUGGER, useAttached, isObservable, createContext, useContext, useEffect, defaults, SYMBOL_DEFAULT, useMountedContext, SYMBOL_OBSERVABLE_WRITABLE, useLightDom, renderToString } from 'woby/ssr'

DEBUGGER.verboseComment = true

const CounterContext = createContext(null)
const NestedContext = createContext(null)
// const useCounterContext = () => useContext(CounterContext)

const useCounterContext = () => useMountedContext(CounterContext)
const useNestedContext = (ref?: any) => useMountedContext(NestedContext, ref)

// Apply defaults to the Counter component manually
const def = () => {
    const value: any = $(0, { type: 'number' } as const)
    return {
        title: $('Counter') as (any | undefined),
        // Store function in observable array to hide it from HTML attributes
        increment: $([() => { value($$(value) + 10) }], { toHtml: o => undefined }) as any | undefined, //hide this from html attributes
        decrement: undefined as (any | undefined), //hide this from html attributes
        value,
        nested: { nested: { text: $('abc') } } as any | undefined,
        // Object with custom serialization
        obj: $({ nested: { text: 'abc' } }, { toHtml: o => JSON.stringify(o), fromHtml: o => JSON.parse(o) }) as any | undefined,
        // Date with custom serialization
        date: $(new Date(), { toHtml: o => o.toISOString(), fromHtml: o => new Date(o) }) as any | undefined,
        disabled: $(false, { type: 'boolean' } as const) as any | undefined
        // Note: children is handled separately by the framework, not included in defaults
    }
}

/**
 * Counter Component
 * 
 * A custom element that demonstrates various features of Woby custom elements:
 * - Reactive properties with type conversion
 * - Nested properties
 * - Style properties
 * - Object and Date serialization
 * - Function properties (hidden from HTML)
 * - Context usage
 */
const Counter = defaults(def, (props) => {
    const {
        title,
        increment: inc,
        // decrement,
        value,
        nested,
        disabled,
        obj,
        date,
        children,
        ...restProps
    } = props

    // const ctx = useCounterContext()
    const { context, mount } = useCounterContext()
    const { context: nc, mount: nm } = useNestedContext()
    // const cc = () => ((props, ctx) => {
    //     return useMemo(() => {
    //         const { children } = props

    //         $$(children)
    //         const v = [...children[SYMBOL_OBSERVABLE_WRITABLE].observers]
    //             .map(observer => observer.context[ctx.symbol])
    //             .filter(f => !!f)

    //         return v
    //     })
    // })(props, CounterContext)


    // Access the function from the observable array
    const increment = $$(inc)[0] ?? (() => { value($$(value) + 1) })
    const decrement = () => { value($$(value) - 1) }

    const v = useMemo(() => $$($$($$(nested)?.nested)?.text))

    const m = useMemo(() => {
        return $$(value) + '' + $$(v)
    })


    return (
        <div {...restProps} style={{ border: '1px solid red' }}>
            <h1>{title}</h1>
            <p>Value: <b>{value}</b></p>
            <p>Memo: <b>{m}</b></p>
            <p>Parent Context (TSX): <b>{context}</b></p>
            {/* <p>Parent Context (ctx): <b>{ctx}</b></p> */}
            {/* <p>Parent Context (CC): <b>{() => $$($$(cc)?.[0])}</b></p> */}
            <p>Object: {() => JSON.stringify($$(obj))}</p>
            <p>Date: {() => $$(date).toString()}</p>
            {/* <p>ContextElement: <ContextValue /></p> */}
            <button disabled={disabled} onClick={increment}>+</button>
            <button disabled={disabled} onClick={decrement}>-</button>

            {() => $$(children) ?
                <div style={{ border: '1px solid gray', padding: '10px' }}>
                    <CounterContext.Provider value={value}>
                        {/* {() => {
                            const ctx = useContext(CounterContext)
                            console.log('ctx in .Provider', $$(ctx))
                            const v = cc()
                            return "CounterContext.Provider {()=>{}}" + $$(v)?.[0]()
                            // return $$(children)
                        }} */}
                        ---CounterContext.Provider---
                        <NestedContext.Provider value={m}>
                            ---NestContext.Provider---
                            {children}
                            ---end NestContext.Provider---
                        </NestedContext.Provider>
                        ---end CounterContext.Provider---
                    </CounterContext.Provider>
                </div>
                : null}
            <p>------------{title} compoent end-------------</p>{mount}
        </div>
    )
})


const ContextValue = defaults(() => ({}), (props) => {
    // const { context, mount, ref } = useCounterContext() //direct use
    const context = useCounterContext() //direct use
    const { context: nc } = useNestedContext(context.ref)

    return <span onClick={() => console.log('clicked', $$(context))}>(Context Value = <b>{context} {nc} </b>)</span>
})

const ProcessedContextValue = defaults(() => ({}), (props) => {
    const v = $(0)

    // const { context, mount, ref } = useMountedContext(CounterContext)
    const context = useMountedContext(CounterContext)

    return <span><button onClick={() => v($$(v) + 1)}>+++</button>(Pcocessed Context Value = <b>{() => context + ' Processed'}</b>){context.mount}</span>
})

/**
 * Register the Counter component as a custom element
 * 
 * This makes the Counter component available as an HTML element
 * with the tag name 'counter-element'.
 * 
 * Observed attributes:
 * - 'value': The counter value
 * - 'class': CSS classes
 * - 'style-*': Style properties (e.g., style$font-size in HTML, style-font-size in JSX)
 * - 'nested-*': Nested properties (e.g., nested$nested$text in HTML, nested-nested-text in JSX)
 */
customElement('counter-element', Counter)
customElement('context-value', ContextValue)
customElement('my-上下문-값', ContextValue)
customElement('processed-context-value', ProcessedContextValue)

// Export components for potential use in other modules
export { Counter, ContextValue, CounterContext, useCounterContext }

/**
 * Extend JSX namespace to include the custom element
 * 
 * This allows TypeScript to recognize the custom element in JSX.
 */
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            /**
             * Counter custom element
             * 
             * HTML element that displays a counter with increment/decrement buttons.
             * 
             * The ElementAttributes<typeof Counter> type automatically includes:
             * - All HTML attributes
             * - Component-specific props from CounterProps
             * - Style properties via the style-* pattern (style$font-size in HTML, style-font-size in JSX)
             * - Nested properties via the nested-* pattern (nested$nested$text in HTML, nested-nested-text in JSX)
             */
            'counter-element': any
            'context-value': any
            'my-上下문-값': any
            'processed-context-value': any

        }
    }
}

/**
 * Application Component
 * 
 * Demonstrates various usage patterns of the Counter custom element:
 * 1. Custom element in TSX
 * 2. Nested custom elements
 * 3. Pure TSX components
 * 4. Mixed HTML and TSX usage
 */
const App = () => {
    /**
     * Counter value observable
     */
    const value = $(0)

    /**
     * Increment function
     */
    const increment = () => value(prev => prev + 1)

    /**
     * Decrement function
     */
    const decrement = () => value(prev => prev - 1)

    return (
        <div>
            <h1>Simple Test</h1>
            <div class="test">
                <h2>Hello World</h2>
                <p>This is a simple test.</p>
            </div>
        </div>
    )
}

/**
 * Render the application to the DOM
 * 
 * Mounts the App component to the element with ID 'app'.
 */
const result = renderToString(<App />)
console.log('Rendered HTML:')
console.log(result)
console.log('--- End of rendered HTML ---')

export default Counter