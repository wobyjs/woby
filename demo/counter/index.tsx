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
import { $, $$, useMemo, render, customElement, DEBUGGER, useAttached, isObservable, createContext, useContext, useEffect, defaults, SYMBOL_DEFAULT, useMountedContext, type ElementAttributes, SYMBOL_OBSERVABLE_WRITABLE, useLightDom, Context, ObservableMaybe } from 'woby'

DEBUGGER.verboseComment = true

const CounterContext = createContext(null)
const NestedContext = createContext(null)
// const useCounterContext = () => useContext(CounterContext)

const useCounterContext = () => useMountedContext(CounterContext)
const useNestedContext = (ref?: ObservableMaybe<Node>) => useMountedContext(NestedContext, ref)

// Apply defaults to the Counter component manually
const def = () => {
    const value: ObservableMaybe<number> | undefined = $(0, { type: 'number' } as const)
    return {
        title: $('Counter') as (ObservableMaybe<string> | undefined),
        // Store function in observable array to hide it from HTML attributes
        increment: $([() => { value($$(value) + 10) }], { toHtml: o => undefined }) as ObservableMaybe<Function> | undefined, //hide this from html attributes
        decrement: undefined as (ObservableMaybe<Function> | undefined), //hide this from html attributes
        value,
        nested: { nested: { text: $('abc') } } as ObservableMaybe<{ nested: { text: ObservableMaybe<string> } }> | undefined,
        // Object with custom serialization
        obj: $({ nested: { text: 'abc' } }, { toHtml: o => JSON.stringify(o), fromHtml: o => JSON.parse(o) }) as ObservableMaybe<{ nested: { text: ObservableMaybe<string> } }> | undefined,
        // Date with custom serialization
        date: $(new Date(), { toHtml: o => o.toISOString(), fromHtml: o => new Date(o) }) as ObservableMaybe<Date> | undefined,
        disabled: $(false, { type: 'boolean' } as const) as ObservableMaybe<boolean> | undefined
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
customElement('my-上下文-值', ContextValue)
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
            'counter-element': ElementAttributes<typeof Counter>
            'context-value': ElementAttributes<typeof ContextValue>
            'my-上下文-值': ElementAttributes<typeof ContextValue>
            'processed-context-value': ElementAttributes<typeof ProcessedContextValue>

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

    return <>

        <h1>Custom element<br /></h1>
        <h1>&lt;counter-element&gt; - &lt;counter-element&gt;:<br /></h1>
        <counter-element title={'Custom element in TSX'}
            style$background-color={'#eee'}
            style$color={'red'}
            style$font-size='1.1em'
            nested$nested$text='xyz'
            // value={0}
            // increment={increment}
            // decrement={decrement}
            nested={{ nested: { text: $('abc') } }}
            obj={$({ nested: { text: 'this obj will be serialized and deserialized to html attribute' } }, { toHtml: obj => JSON.stringify(obj), fromHtml: obj => JSON.parse(obj) })} //this obj will be serialized and deserialized to html attribute
            class={'border-2 border-black border-solid bg-amber-400'}>
            <context-value />
            <ContextValue />
            <ProcessedContextValue />
            <processed-context-value />

            <h2>Nested Custom &lt;counter-element&gt;:<br /></h2>

            <counter-element title={'counter-element Nested'}
                style$color={'orange'}
                style$font-size='1em'
                nested$nested$text=' nested context'
                nested={{ nested: { text: $(' nested context') } }}
                class={'border-2 border-black border-solid bg-amber-400 m-10'}>
                <context-value />
                <ContextValue />
            </counter-element>
        </counter-element>
        <h1>Pure TSX &lt;Counter&gt; - &lt;Counter&gt;</h1>
        <Counter title='TSX Counter Main' value={value} increment={increment} decrement={decrement} >
            <context-value />
            <ContextValue />
            <Counter title='TSX Counter Nested' >
                <context-value />
                <ContextValue />
            </Counter>
        </Counter>

        <h1>TSX - HTML &lt;Counter&gt; - &lt;counter-element&gt;</h1>
        <Counter title='TSX - HTML Counter Main' >
            <context-value />
            <ContextValue />
            <counter-element title={'counter-element Nested'}
                style$color={'orange'}
                style$font-size='1em'
                nested$nested$text=' nested context'
                nested={{ nested: { text: $(' nested context') } }}
                class={'border-2 border-black border-solid bg-amber-400 m-10'}>
                <p>obj attribute not diplay since, it is not explicit defined</p>
                <context-value />
                <ContextValue />
            </counter-element>
        </Counter>

        <h1>HTML - TSX &lt;counter-element&gt; - &lt;Counter&gt;</h1>
        <counter-element title={'HTML - TSX main'}
            style$color={'orange'}
            style$font-size='1em'
            nested$nested$text=' nested context'
            nested={{ nested: { text: $(' nested context') } }}
            class={'border-2 border-black border-solid bg-amber-400 m-10'}>
            <context-value />
            <ContextValue />
            <Counter title='TSX Counter nested' >
                <context-value />
                <ContextValue />
            </Counter>
        </counter-element>

    </>
}

/**
 * Render the application to the DOM
 * 
 * Mounts the App component to the element with ID 'app'.
 */
render(<App />, document.getElementById('app'))

export default Counter