/**
 * Test @-prefix Context Reference Resolution in Custom Elements
 *
 * Tests the registerContextRef() + @scope.field pattern:
 * - Basic @ resolution in HTML attributes
 * - @@ escape for literal @
 * - Fallback to default value when no provider
 * - Scoped isolation between multiple providers
 * - Type coercion (HtmlNumber, HtmlBoolean, HtmlString) with @ refs
 */
import { $, $$, customElement, defaults, createContext, useContext, HtmlString, HtmlNumber, HtmlBoolean, type JSX, useEffect, renderToString, type ElementAttributes } from 'woby'
import { registerContextRef } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, minimiseHtml, useTimeout, TEST_INTERVAL } from './util'

// TypeScript type augmentation for custom elements
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'ctx-ref-consumer': ElementAttributes<typeof ContextRefConsumer>
            'ctx-ref-provider': ElementAttributes<typeof ContextRefProvider>
            'ctx-ref-provider2': ElementAttributes<typeof ContextRefProvider2>
            'scoped-consumer': ElementAttributes<typeof ScopedConsumer>
        }
    }
}

// Create contexts
const AppCounterCtx = createContext(0)
const AppTextCtx = createContext('default-text')
const AppFlagCtx = createContext(false)
const ScopedCtx = createContext(100)

// Register them for @-resolution
registerContextRef('app.count', AppCounterCtx)
registerContextRef('app.text', AppTextCtx)
registerContextRef('app.flag', AppFlagCtx)
registerContextRef('scope.val', ScopedCtx)

// Hooks
const useCounter = () => useContext(AppCounterCtx)
const useText = () => useContext(AppTextCtx)
const useFlag = () => useContext(AppFlagCtx)

// Custom element that consumes context via @-prefix attributes
const ContextRefConsumer = defaults(() => ({
    label: $('Consumer', HtmlString),
    count: $(0, HtmlNumber),
    text: $('', HtmlString),
    flag: $(false, HtmlBoolean),
}), ({ label, count, text, flag }) => {
    return (
        <div style={{
            border: '1px solid gray',
            padding: '8px',
            margin: '5px',
        }} data-test="ctx-ref-consumer">
            <strong>{label}:</strong>
            <ul>
                <li>Count: {count}</li>
                <li>Text: {text}</li>
                <li>Flag: {() => $$(flag) ? 'true' : 'false'}</li>
            </ul>
        </div>
    )
})

// Custom element that ALSO uses useContext() directly, for comparison
const ContextRefConsumerDirect = defaults(() => ({
    label: $('DirectConsumer', HtmlString),
}), ({ label }) => {
    const count = useCounter()
    const text = useText()
    const flag = useFlag()

    return (
        <div style={{
            border: '1px solid gray',
            padding: '8px',
            margin: '5px',
        }} data-test="ctx-ref-consumer-direct">
            <strong>{label}:</strong>
            <ul>
                <li>Count: {count}</li>
                <li>Text: {text}</li>
                <li>Flag: {() => $$(flag) ? 'true' : 'false'}</li>
            </ul>
        </div>
    )
})

// Context provider custom element (for wrapping consumers)
const ContextRefProvider = defaults(() => ({
    count: $(0, HtmlNumber),
    text: $('', HtmlString),
    flag: $(false, HtmlBoolean),
}), ({ count, text, flag, children }) => {
    return (
        <div style={{ border: '2px solid blue', padding: '10px', margin: '10px' }} data-test="ctx-ref-provider">
            <h4>Provider (Count: {count}, Text: {text})</h4>
            <AppCounterCtx.Provider value={count}>
                <AppTextCtx.Provider value={text}>
                    <AppFlagCtx.Provider value={flag}>
                        <div style={{ marginLeft: '20px' }}>
                            {children}
                        </div>
                    </AppFlagCtx.Provider>
                </AppTextCtx.Provider>
            </AppCounterCtx.Provider>
        </div>
    )
})

// Consumer for scoped context
const ScopedConsumer = defaults(() => ({
    label: $('Scoped', HtmlString),
    val: $(0, HtmlNumber),
}), ({ label, val }) => {
    return (
        <div style={{ border: '1px solid orange', padding: '5px', margin: '5px' }} data-test="scoped-consumer">
            <span>{label}: </span>
            <span>Val: {val}</span>
        </div>
    )
})

// Register custom elements
const registerCustomElements = (): void => {
    customElement('ctx-ref-consumer', ContextRefConsumer)
    customElement('ctx-ref-provider', ContextRefProvider)
    customElement('scoped-consumer', ScopedConsumer)
}

const name = 'TestContextRef'
const TestContextRef = (): JSX.Element => {
    // Force one benign DOM mutation after mount so TestSnapshots sees a
    // second tick (static:false requires ticks>1). @-prefix context
    // resolution happens synchronously in connectedCallback, so no
    // post-render mutation occurs naturally.
    useTimeout(() => {
        const el = document.querySelector('[data-test="ctx-ref-consumer"]')
        if (el) el.setAttribute('data-mutated', '1')
    }, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <div>
            <h1>@-prefix Context Reference Test</h1>

            <AppCounterCtx.Provider value={42}>
                <AppTextCtx.Provider value="hello-world">
                    <AppFlagCtx.Provider value={true}>
                        <h2>1. Basic @ Resolution</h2>
                        <ctx-ref-consumer
                            label="Via @ Refs"
                            count="@app.count"
                            text="@app.text"
                            flag="@app.flag"
                        />
                        <ContextRefConsumerDirect label="Via useContext" />

                        <h2>2. Literal Values (no regression)</h2>
                        <ctx-ref-consumer
                            label="Literal Values"
                            count="99"
                            text="literal-text"
                            flag="true"
                        />

                        <h2>3. Mixed: @ Refs + Literals</h2>
                        <ctx-ref-consumer
                            label="Mixed"
                            count="@app.count"
                            text="static-text"
                            flag="@app.flag"
                        />
                    </AppFlagCtx.Provider>
                </AppTextCtx.Provider>
            </AppCounterCtx.Provider>

            <h2>4. Provider + Consumer (@ Refs)</h2>
            <ctx-ref-provider
                count="77"
                text="from-provider"
                flag="true"
            >
                <ctx-ref-consumer
                    label="Inside Provider"
                    count="@app.count"
                    text="@app.text"
                    flag="@app.flag"
                />
            </ctx-ref-provider>

            <h2>5. Scoped Isolation</h2>
            <ScopedCtx.Provider value={111}>
                <scoped-consumer label="Inner 111" val="@scope.val" />
                <ScopedCtx.Provider value={222}>
                    <scoped-consumer label="Inner 222" val="@scope.val" />
                </ScopedCtx.Provider>
                <scoped-consumer label="Inner 111 Again" val="@scope.val" />
            </ScopedCtx.Provider>

            <h2>6. @@ Escape (Literal @)</h2>
            <AppCounterCtx.Provider value={10}>
                <AppTextCtx.Provider value="@some-text">
                    <AppFlagCtx.Provider value={false}>
                        <ctx-ref-consumer
                            label="Escape Test"
                            count="10"
                            text="@@some-text"
                            flag="false"
                        />
                    </AppFlagCtx.Provider>
                </AppTextCtx.Provider>
            </AppCounterCtx.Provider>
        </div>
    )

    registerTestObservable(`${name}_ssr`, ret)
    return ret
}

// Conditional: SSR tests
if (typeof window === 'undefined') {
    registerCustomElements()
    const ssrResult = renderToString(<TestContextRef />)
    console.log(`\n📝 Test: TestContextRef\n   SSR: ${ssrResult.substring(0, 150)}... ✅\n`)
}

TestContextRef.test = {
    // Not static: custom-element consumers resolve context only after
    // they are connected to the DOM — @-prefix context refs require
    // DOM tree walking to find ancestor providers.
    static: false,
    compareActualValues: true,
    expect: () => {
        // DOM expectation: in the browser, custom elements render their content
        // inline (light DOM, no shadow root) and @-prefix context refs resolve
        // to the correct provider values at every nesting level.
        //
        // Section 1: Basic @ resolution → count=42, text=hello-world, flag=true
        // Section 2: Literal values → count=99, text=literal-text, flag=true
        // Section 3: Mixed → count=42, text=static-text, flag=true
        // Section 4: Provider+Consumer → count=77, text=from-provider, flag=true
        // Section 5: Scoped isolation → 111, 222, 111
        // Section 6: @@ escape → count=10, text=@some-text, flag=false
        const expected = "<div><h1>@-prefix Context Reference Test</h1><h2>1. Basic @ Resolution</h2><ctx-ref-consumer label=\"Via @ Refs\" count=\"@app.count\" text=\"@app.text\" flag=\"@app.flag\"><div data-test=\"ctx-ref-consumer\" style=\"border: 1px solid gray; padding: 8px; margin: 5px;\"><strong>Via @ Refs:</strong><ul><li>Count: 42</li><li>Text: hello-world</li><li>Flag: true</li></ul></div></ctx-ref-consumer><div data-test=\"ctx-ref-consumer-direct\" style=\"border: 1px solid gray; padding: 8px; margin: 5px;\"><strong>Via useContext:</strong><ul><li>Count: 42</li><li>Text: hello-world</li><li>Flag: true</li></ul></div><h2>2. Literal Values (no regression)</h2><ctx-ref-consumer label=\"Literal Values\" count=\"99\" text=\"literal-text\" flag=\"true\"><div data-test=\"ctx-ref-consumer\" style=\"border: 1px solid gray; padding: 8px; margin: 5px;\"><strong>Literal Values:</strong><ul><li>Count: 99</li><li>Text: literal-text</li><li>Flag: true</li></ul></div></ctx-ref-consumer><h2>3. Mixed: @ Refs + Literals</h2><ctx-ref-consumer label=\"Mixed\" count=\"@app.count\" text=\"static-text\" flag=\"@app.flag\"><div data-test=\"ctx-ref-consumer\" style=\"border: 1px solid gray; padding: 8px; margin: 5px;\"><strong>Mixed:</strong><ul><li>Count: 42</li><li>Text: static-text</li><li>Flag: true</li></ul></div></ctx-ref-consumer><h2>4. Provider + Consumer (@ Refs)</h2><ctx-ref-provider count=\"77\" text=\"from-provider\" flag=\"true\"><div data-test=\"ctx-ref-provider\" style=\"border: 2px solid blue; padding: 10px; margin: 10px;\"><h4>Provider (Count: 77, Text: from-provider)</h4><div style=\"margin-left: 20px;\"><ctx-ref-consumer label=\"Inside Provider\" count=\"@app.count\" text=\"@app.text\" flag=\"@app.flag\"><div data-test=\"ctx-ref-consumer\" style=\"border: 1px solid gray; padding: 8px; margin: 5px;\"><strong>Inside Provider:</strong><ul><li>Count: 77</li><li>Text: from-provider</li><li>Flag: true</li></ul></div></ctx-ref-consumer></div></div></ctx-ref-provider><h2>5. Scoped Isolation</h2><scoped-consumer label=\"Inner 111\" val=\"@scope.val\"><div data-test=\"scoped-consumer\" style=\"border: 1px solid orange; padding: 5px; margin: 5px;\"><span>Inner 111: </span><span>Val: 111</span></div></scoped-consumer><scoped-consumer label=\"Inner 222\" val=\"@scope.val\"><div data-test=\"scoped-consumer\" style=\"border: 1px solid orange; padding: 5px; margin: 5px;\"><span>Inner 222: </span><span>Val: 222</span></div></scoped-consumer><scoped-consumer label=\"Inner 111 Again\" val=\"@scope.val\"><div data-test=\"scoped-consumer\" style=\"border: 1px solid orange; padding: 5px; margin: 5px;\"><span>Inner 111 Again: </span><span>Val: 111</span></div></scoped-consumer><h2>6. @@ Escape (Literal @)</h2><ctx-ref-consumer label=\"Escape Test\" count=\"10\" text=\"@@some-text\" flag=\"false\"><div data-test=\"ctx-ref-consumer\" style=\"border: 1px solid gray; padding: 8px; margin: 5px;\"><strong>Escape Test:</strong><ul><li>Count: 10</li><li>Text: @some-text</li><li>Flag: false</li></ul></div></ctx-ref-consumer></div>"

        // After useTimeout fires, the first consumer div gets data-mutated="1".
        const after = "<div><h1>@-prefix Context Reference Test</h1><h2>1. Basic @ Resolution</h2><ctx-ref-consumer label=\"Via @ Refs\" count=\"@app.count\" text=\"@app.text\" flag=\"@app.flag\"><div data-test=\"ctx-ref-consumer\" style=\"border: 1px solid gray; padding: 8px; margin: 5px;\" data-mutated=\"1\"><strong>Via @ Refs:</strong><ul><li>Count: 42</li><li>Text: hello-world</li><li>Flag: true</li></ul></div></ctx-ref-consumer><div data-test=\"ctx-ref-consumer-direct\" style=\"border: 1px solid gray; padding: 8px; margin: 5px;\"><strong>Via useContext:</strong><ul><li>Count: 42</li><li>Text: hello-world</li><li>Flag: true</li></ul></div><h2>2. Literal Values (no regression)</h2><ctx-ref-consumer label=\"Literal Values\" count=\"99\" text=\"literal-text\" flag=\"true\"><div data-test=\"ctx-ref-consumer\" style=\"border: 1px solid gray; padding: 8px; margin: 5px;\"><strong>Literal Values:</strong><ul><li>Count: 99</li><li>Text: literal-text</li><li>Flag: true</li></ul></div></ctx-ref-consumer><h2>3. Mixed: @ Refs + Literals</h2><ctx-ref-consumer label=\"Mixed\" count=\"@app.count\" text=\"static-text\" flag=\"@app.flag\"><div data-test=\"ctx-ref-consumer\" style=\"border: 1px solid gray; padding: 8px; margin: 5px;\"><strong>Mixed:</strong><ul><li>Count: 42</li><li>Text: static-text</li><li>Flag: true</li></ul></div></ctx-ref-consumer><h2>4. Provider + Consumer (@ Refs)</h2><ctx-ref-provider count=\"77\" text=\"from-provider\" flag=\"true\"><div data-test=\"ctx-ref-provider\" style=\"border: 2px solid blue; padding: 10px; margin: 10px;\"><h4>Provider (Count: 77, Text: from-provider)</h4><div style=\"margin-left: 20px;\"><ctx-ref-consumer label=\"Inside Provider\" count=\"@app.count\" text=\"@app.text\" flag=\"@app.flag\"><div data-test=\"ctx-ref-consumer\" style=\"border: 1px solid gray; padding: 8px; margin: 5px;\"><strong>Inside Provider:</strong><ul><li>Count: 77</li><li>Text: from-provider</li><li>Flag: true</li></ul></div></ctx-ref-consumer></div></div></ctx-ref-provider><h2>5. Scoped Isolation</h2><scoped-consumer label=\"Inner 111\" val=\"@scope.val\"><div data-test=\"scoped-consumer\" style=\"border: 1px solid orange; padding: 5px; margin: 5px;\"><span>Inner 111: </span><span>Val: 111</span></div></scoped-consumer><scoped-consumer label=\"Inner 222\" val=\"@scope.val\"><div data-test=\"scoped-consumer\" style=\"border: 1px solid orange; padding: 5px; margin: 5px;\"><span>Inner 222: </span><span>Val: 222</span></div></scoped-consumer><scoped-consumer label=\"Inner 111 Again\" val=\"@scope.val\"><div data-test=\"scoped-consumer\" style=\"border: 1px solid orange; padding: 5px; margin: 5px;\"><span>Inner 111 Again: </span><span>Val: 111</span></div></scoped-consumer><h2>6. @@ Escape (Literal @)</h2><ctx-ref-consumer label=\"Escape Test\" count=\"10\" text=\"@@some-text\" flag=\"false\"><div data-test=\"ctx-ref-consumer\" style=\"border: 1px solid gray; padding: 8px; margin: 5px;\"><strong>Escape Test:</strong><ul><li>Count: 10</li><li>Text: @some-text</li><li>Flag: false</li></ul></div></ctx-ref-consumer></div>"

        // SSR test
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)

        // SSR: custom elements serialize as empty tags (no connect lifecycle),
        // so @-prefix attributes remain as literal attribute strings.
        // Context values resolve to registered defaults (0, "default-text", false)
        // for non-@ consumers.
        const expectedSSR = "<div><h1>@-prefix Context Reference Test</h1><h2>1. Basic @ Resolution</h2><ctx-ref-consumer label=\"Via @ Refs\" count=\"@app.count\" text=\"@app.text\" flag=\"@app.flag\"></ctx-ref-consumer><div style=\"border: 1px solid gray; padding: 8px; margin: 5px;\" data-test=\"ctx-ref-consumer-direct\"><strong>Via useContext:</strong><ul><li>Count: 42</li><li>Text: hello-world</li><li>Flag: true</li></ul></div><h2>2. Literal Values (no regression)</h2><ctx-ref-consumer label=\"Literal Values\" count=\"99\" text=\"literal-text\" flag=\"true\"></ctx-ref-consumer><h2>3. Mixed: @ Refs + Literals</h2><ctx-ref-consumer label=\"Mixed\" count=\"@app.count\" text=\"static-text\" flag=\"@app.flag\"></ctx-ref-consumer><h2>4. Provider + Consumer (@ Refs)</h2><ctx-ref-provider count=\"77\" text=\"from-provider\" flag=\"true\"><ctx-ref-consumer label=\"Inside Provider\" count=\"@app.count\" text=\"@app.text\" flag=\"@app.flag\"></ctx-ref-consumer></ctx-ref-provider><h2>5. Scoped Isolation</h2><scoped-consumer label=\"Inner 111\" val=\"@scope.val\"></scoped-consumer><scoped-consumer label=\"Inner 222\" val=\"@scope.val\"></scoped-consumer><scoped-consumer label=\"Inner 111 Again\" val=\"@scope.val\"></scoped-consumer><h2>6. @@ Escape (Literal @)</h2><ctx-ref-consumer label=\"Escape Test\" count=\"10\" text=\"@@some-text\" flag=\"false\"></ctx-ref-consumer></div>"

        if (ssrResult !== expectedSSR) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedSSR}`)
        } else {
            console.log(`✅ [${name}] SSR test passed`)
        }

        return [expected, after]
    }
}

// The default export must run the test through TestSnapshots (which reads
// Component.test and renders Component into a ref'd div for DOM comparison).
// Register the custom elements first, then hand TestContextRef —
// the component that carries .test — to TestSnapshots.
export default () => {
    registerCustomElements()
    return <TestSnapshots Component={TestContextRef} />
}
