/**
 * Test @-prefix Context Reference Resolution via dangerouslySetInnerHTML
 *
 * This tests that `@scope.field` attributes in raw HTML (parsed via
 * dangerouslySetInnerHTML → innerHTML) correctly resolve context values
 * from ancestor providers.
 *
 * The resolution path for raw HTML custom elements:
 *   innerHTML → connectedCallback → attributeChangedCallback
 *   → setObservableValue → resolveContextRef("@app.count", this)
 *   → collectAncestorContextWrap(element) → DOM ancestor walk
 *
 * Tests:
 * 1. Basic @ resolution: count="@app.count" from provider → value=42
 * 2. Literal values still work: count="99" → value=99
 * 3. Mixed @ refs + literals: count="@app.count" + text="static-text"
 * 4. Provider+Consumer: ctx-ref-provider wrapping ctx-ref-consumer with @ refs
 * 5. Scoped isolation: nested providers with same @-prefix key
 * 6. @@ Escape: @@some-text → literal "@some-text"
 */
import { $, $$, customElement, defaults, useContext, HtmlString, HtmlNumber, HtmlBoolean, type JSX, renderToString, type ElementAttributes } from 'woby'
import { registerContextRef } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, minimiseHtml, useTimeout, TEST_INTERVAL } from './util'
import { AppCounterCtx, AppTextCtx, AppFlagCtx, ScopedCtx } from './TestContextRef.shared'

// DO NOT createContext() or registerContextRef() here — both are done in
// TestContextRef.shared.tsx and TestContextRef.tsx respectively. The shared
// module ensures the same Symbol objects are used everywhere.

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

// Context provider custom element (for wrapping consumers in raw HTML)
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
// Note: raw context providers (AppCounterCtx.Provider, etc.) are registered
// directly as custom elements, mapping their HTML `value` attribute to the
// Context.Provider's `value` prop. This is the established pattern for
// dangerouslySetInnerHTML tests (see TestCustomElementContext.html.tsx).
const registerCustomElements = (): void => {
    customElement('ctx-ref-consumer', ContextRefConsumer)
    customElement('ctx-ref-provider', ContextRefProvider)
    customElement('scoped-consumer', ScopedConsumer)
    customElement('app-counter-ctx', AppCounterCtx.Provider)
    customElement('app-text-ctx', AppTextCtx.Provider)
    customElement('app-flag-ctx', AppFlagCtx.Provider)
    customElement('scoped-ctx', ScopedCtx.Provider)
}

const name = 'TestContextRefHtml'
const TestContextRefHtml = (): JSX.Element => {
    // Force one benign light-DOM mutation after mount so TestSnapshots sees a
    // second tick (static:false requires ticks>1). This adds a data-mutated
    // attribute on the first consumer host; it does NOT change any resolved
    // context value, so the consumer content is identical before and after.
    useTimeout(() => {
        // Find our TestContextRefHtml container by looking for the h1 with
        // our unique heading text, then query within it for the first
        // <ctx-ref-consumer>. This avoids cross-contamination: other tests
        // also have <ctx-ref-consumer> elements in their test trees.
        const allH1s = document.querySelectorAll('h1')
        for (const h1 of allH1s) {
            if (h1.textContent === '@-prefix Context Reference via HTML') {
                const container = h1.parentElement
                if (container) {
                    const el = container.querySelector('ctx-ref-consumer')
                    if (el) {
                        el.setAttribute('data-mutated', '1')
                        console.log(`[TestContextRefHtml] set data-mutated on ${el.tagName}: ${el.getAttribute('data-mutated')}`)
                    } else {
                        console.log(`[TestContextRefHtml] ctx-ref-consumer not found inside HTML container`)
                    }
                }
                break
            }
        }
    }, TEST_INTERVAL)

    const rawHtml = `
            <h1>@-prefix Context Reference via HTML</h1>
            <app-counter-ctx value="42"><app-text-ctx value="hello-world"><app-flag-ctx value="true">

                <h2>1. Basic @ Resolution</h2>
                <ctx-ref-consumer
                    label="Via @ Refs"
                    count="@app.count"
                    text="@app.text"
                    flag="@app.flag"
                ></ctx-ref-consumer>

                <h2>2. Literal Values (no regression)</h2>
                <ctx-ref-consumer
                    label="Literal Values"
                    count="99"
                    text="literal-text"
                    flag="true"
                ></ctx-ref-consumer>

                <h2>3. Mixed: @ Refs + Literals</h2>
                <ctx-ref-consumer
                    label="Mixed"
                    count="@app.count"
                    text="static-text"
                    flag="@app.flag"
                ></ctx-ref-consumer>

            </app-flag-ctx></app-text-ctx></app-counter-ctx>

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
                ></ctx-ref-consumer>
            </ctx-ref-provider>

            <h2>5. Scoped Isolation</h2>
            <scoped-ctx value="111">
                <scoped-consumer label="Inner 111" val="@scope.val"></scoped-consumer>
                <scoped-ctx value="222">
                    <scoped-consumer label="Inner 222" val="@scope.val"></scoped-consumer>
                </scoped-ctx>
                <scoped-consumer label="Inner 111 Again" val="@scope.val"></scoped-consumer>
            </scoped-ctx>

            <h2>6. @@ Escape (Literal @)</h2>
            <app-counter-ctx value="10"><app-text-ctx value="@@some-text"><app-flag-ctx value="false">
                <ctx-ref-consumer
                    label="Escape Test"
                    count="10"
                    text="@@some-text"
                    flag="false"
                ></ctx-ref-consumer>
            </app-flag-ctx></app-text-ctx></app-counter-ctx>`

    const ret: JSX.Element = () => (
        <div dangerouslySetInnerHTML={{ __html: rawHtml }}>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests
if (typeof window === 'undefined') {
    registerCustomElements()
    const ssrResult = renderToString(<TestContextRefHtml />)
    console.log(`\n📝 Test: TestContextRefHtml\n   SSR: ${ssrResult.substring(0, 150)}... ✅\n`)
}

TestContextRefHtml.test = {
    // Not static: custom-element consumers resolve context only after
    // they are connected to the DOM — @-prefix context refs require
    // DOM tree walking to find ancestor providers.
    static: false,
    compareActualValues: true,
    expect: () => {
        // DOM expectation: in the browser, custom elements render their content
        // via shadow DOM, so minimiseHtml(getInnerHTML(element)) serializes them as:
        //   <tag attrs><template shadowrootmode="open" shadowrootserializable="">shadow content</template></tag>
        // The actual output from the browser includes these wrappers for all custom elements.
        const expected = minimiseHtml(`<div><h1>@-prefix Context Reference via HTML</h1><app-counter-ctx value="42"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="42"><slot><app-text-ctx value="hello-world"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="hello-world"><slot><app-flag-ctx value="true"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="true"><slot><h2>1. Basic @ Resolution</h2><ctx-ref-consumer label="Via @ Refs" count="@app.count" text="@app.text" flag="@app.flag"><template shadowrootmode="open" shadowrootserializable=""><div data-test="ctx-ref-consumer" style="border: 1px solid gray; padding: 8px; margin: 5px;"><strong>Via @ Refs:</strong><ul><li>Count: 42</li><li>Text: hello-world</li><li>Flag: true</li></ul></div></template></ctx-ref-consumer><h2>2. Literal Values (no regression)</h2><ctx-ref-consumer label="Literal Values" count="99" text="literal-text" flag="true"><template shadowrootmode="open" shadowrootserializable=""><div data-test="ctx-ref-consumer" style="border: 1px solid gray; padding: 8px; margin: 5px;"><strong>Literal Values:</strong><ul><li>Count: 99</li><li>Text: literal-text</li><li>Flag: true</li></ul></div></template></ctx-ref-consumer><h2>3. Mixed: @ Refs + Literals</h2><ctx-ref-consumer label="Mixed" count="@app.count" text="static-text" flag="@app.flag"><template shadowrootmode="open" shadowrootserializable=""><div data-test="ctx-ref-consumer" style="border: 1px solid gray; padding: 8px; margin: 5px;"><strong>Mixed:</strong><ul><li>Count: 42</li><li>Text: static-text</li><li>Flag: true</li></ul></div></template></ctx-ref-consumer></slot></context-provider></template></app-flag-ctx></slot></context-provider></template></app-text-ctx></slot></context-provider></template></app-counter-ctx><h2>4. Provider + Consumer (@ Refs)</h2><ctx-ref-provider count="77" text="from-provider" flag="true"><template shadowrootmode="open" shadowrootserializable=""><div data-test="ctx-ref-provider" style="border: 2px solid blue; padding: 10px; margin: 10px;"><h4>Provider (Count: 77, Text: from-provider)</h4><div style="margin-left: 20px;"><slot><ctx-ref-consumer label="Inside Provider" count="@app.count" text="@app.text" flag="@app.flag"><template shadowrootmode="open" shadowrootserializable=""><div data-test="ctx-ref-consumer" style="border: 1px solid gray; padding: 8px; margin: 5px;"><strong>Inside Provider:</strong><ul><li>Count: 77</li><li>Text: from-provider</li><li>Flag: true</li></ul></div></template></ctx-ref-consumer></slot></div></div></template></ctx-ref-provider><h2>5. Scoped Isolation</h2><scoped-ctx value="111"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="111"><slot><scoped-consumer label="Inner 111" val="@scope.val"><template shadowrootmode="open" shadowrootserializable=""><div data-test="scoped-consumer" style="border: 1px solid orange; padding: 5px; margin: 5px;"><span>Inner 111: </span><span>Val: 111</span></div></template></scoped-consumer><scoped-ctx value="222"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="222"><slot><scoped-consumer label="Inner 222" val="@scope.val"><template shadowrootmode="open" shadowrootserializable=""><div data-test="scoped-consumer" style="border: 1px solid orange; padding: 5px; margin: 5px;"><span>Inner 222: </span><span>Val: 222</span></div></template></scoped-consumer></slot></context-provider></template></scoped-ctx><scoped-consumer label="Inner 111 Again" val="@scope.val"><template shadowrootmode="open" shadowrootserializable=""><div data-test="scoped-consumer" style="border: 1px solid orange; padding: 5px; margin: 5px;"><span>Inner 111 Again: </span><span>Val: 111</span></div></template></scoped-consumer></slot></context-provider></template></scoped-ctx><h2>6. @@ Escape (Literal @)</h2><app-counter-ctx value="10"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="10"><slot><app-text-ctx value="@@some-text"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="@some-text"><slot><app-flag-ctx value="false"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="false"><slot><ctx-ref-consumer label="Escape Test" count="10" text="@@some-text" flag="false"><template shadowrootmode="open" shadowrootserializable=""><div data-test="ctx-ref-consumer" style="border: 1px solid gray; padding: 8px; margin: 5px;"><strong>Escape Test:</strong><ul><li>Count: 10</li><li>Text: @some-text</li><li>Flag: false</li></ul></div></template></ctx-ref-consumer></slot></context-provider></template></app-flag-ctx></slot></context-provider></template></app-text-ctx></slot></context-provider></template></app-counter-ctx></div>`)

        // After useTimeout fires, the first ctx-ref-consumer host gets data-mutated="1".
        // The attribute is appended at the end by setAttribute, so it appears after flag.
        const after = minimiseHtml(`<div><h1>@-prefix Context Reference via HTML</h1><app-counter-ctx value="42"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="42"><slot><app-text-ctx value="hello-world"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="hello-world"><slot><app-flag-ctx value="true"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="true"><slot><h2>1. Basic @ Resolution</h2><ctx-ref-consumer label="Via @ Refs" count="@app.count" text="@app.text" flag="@app.flag" data-mutated="1"><template shadowrootmode="open" shadowrootserializable=""><div data-test="ctx-ref-consumer" style="border: 1px solid gray; padding: 8px; margin: 5px;"><strong>Via @ Refs:</strong><ul><li>Count: 42</li><li>Text: hello-world</li><li>Flag: true</li></ul></div></template></ctx-ref-consumer><h2>2. Literal Values (no regression)</h2><ctx-ref-consumer label="Literal Values" count="99" text="literal-text" flag="true"><template shadowrootmode="open" shadowrootserializable=""><div data-test="ctx-ref-consumer" style="border: 1px solid gray; padding: 8px; margin: 5px;"><strong>Literal Values:</strong><ul><li>Count: 99</li><li>Text: literal-text</li><li>Flag: true</li></ul></div></template></ctx-ref-consumer><h2>3. Mixed: @ Refs + Literals</h2><ctx-ref-consumer label="Mixed" count="@app.count" text="static-text" flag="@app.flag"><template shadowrootmode="open" shadowrootserializable=""><div data-test="ctx-ref-consumer" style="border: 1px solid gray; padding: 8px; margin: 5px;"><strong>Mixed:</strong><ul><li>Count: 42</li><li>Text: static-text</li><li>Flag: true</li></ul></div></template></ctx-ref-consumer></slot></context-provider></template></app-flag-ctx></slot></context-provider></template></app-text-ctx></slot></context-provider></template></app-counter-ctx><h2>4. Provider + Consumer (@ Refs)</h2><ctx-ref-provider count="77" text="from-provider" flag="true"><template shadowrootmode="open" shadowrootserializable=""><div data-test="ctx-ref-provider" style="border: 2px solid blue; padding: 10px; margin: 10px;"><h4>Provider (Count: 77, Text: from-provider)</h4><div style="margin-left: 20px;"><slot><ctx-ref-consumer label="Inside Provider" count="@app.count" text="@app.text" flag="@app.flag"><template shadowrootmode="open" shadowrootserializable=""><div data-test="ctx-ref-consumer" style="border: 1px solid gray; padding: 8px; margin: 5px;"><strong>Inside Provider:</strong><ul><li>Count: 77</li><li>Text: from-provider</li><li>Flag: true</li></ul></div></template></ctx-ref-consumer></slot></div></div></template></ctx-ref-provider><h2>5. Scoped Isolation</h2><scoped-ctx value="111"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="111"><slot><scoped-consumer label="Inner 111" val="@scope.val"><template shadowrootmode="open" shadowrootserializable=""><div data-test="scoped-consumer" style="border: 1px solid orange; padding: 5px; margin: 5px;"><span>Inner 111: </span><span>Val: 111</span></div></template></scoped-consumer><scoped-ctx value="222"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="222"><slot><scoped-consumer label="Inner 222" val="@scope.val"><template shadowrootmode="open" shadowrootserializable=""><div data-test="scoped-consumer" style="border: 1px solid orange; padding: 5px; margin: 5px;"><span>Inner 222: </span><span>Val: 222</span></div></template></scoped-consumer></slot></context-provider></template></scoped-ctx><scoped-consumer label="Inner 111 Again" val="@scope.val"><template shadowrootmode="open" shadowrootserializable=""><div data-test="scoped-consumer" style="border: 1px solid orange; padding: 5px; margin: 5px;"><span>Inner 111 Again: </span><span>Val: 111</span></div></template></scoped-consumer></slot></context-provider></template></scoped-ctx><h2>6. @@ Escape (Literal @)</h2><app-counter-ctx value="10"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="10"><slot><app-text-ctx value="@@some-text"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="@some-text"><slot><app-flag-ctx value="false"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="false"><slot><ctx-ref-consumer label="Escape Test" count="10" text="@@some-text" flag="false"><template shadowrootmode="open" shadowrootserializable=""><div data-test="ctx-ref-consumer" style="border: 1px solid gray; padding: 8px; margin: 5px;"><strong>Escape Test:</strong><ul><li>Count: 10</li><li>Text: @some-text</li><li>Flag: false</li></ul></div></template></ctx-ref-consumer></slot></context-provider></template></app-flag-ctx></slot></context-provider></template></app-text-ctx></slot></context-provider></template></app-counter-ctx></div>`)

        // SSR test
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = minimiseHtml(renderToString(ssrComponent))

        // SSR: custom elements serialize as empty tags (no connect lifecycle),
        // so @-prefix attributes remain as literal attribute strings.
        // The SSR output preserves whitespace from the HTML template literal string,
        // so we normalise both sides with minimiseHtml for comparison.
        const expectedSSR = minimiseHtml(`<div><h1>@-prefix Context Reference via HTML</h1><app-counter-ctx value="42"><app-text-ctx value="hello-world"><app-flag-ctx value="true"><h2>1. Basic @ Resolution</h2><ctx-ref-consumer label="Via @ Refs" count="@app.count" text="@app.text" flag="@app.flag" ></ctx-ref-consumer><h2>2. Literal Values (no regression)</h2><ctx-ref-consumer label="Literal Values" count="99" text="literal-text" flag="true" ></ctx-ref-consumer><h2>3. Mixed: @ Refs + Literals</h2><ctx-ref-consumer label="Mixed" count="@app.count" text="static-text" flag="@app.flag" ></ctx-ref-consumer></app-flag-ctx></app-text-ctx></app-counter-ctx><h2>4. Provider + Consumer (@ Refs)</h2><ctx-ref-provider count="77" text="from-provider" flag="true" ><ctx-ref-consumer label="Inside Provider" count="@app.count" text="@app.text" flag="@app.flag" ></ctx-ref-consumer></ctx-ref-provider><h2>5. Scoped Isolation</h2><scoped-ctx value="111"><scoped-consumer label="Inner 111" val="@scope.val"></scoped-consumer><scoped-ctx value="222"><scoped-consumer label="Inner 222" val="@scope.val"></scoped-consumer></scoped-ctx><scoped-consumer label="Inner 111 Again" val="@scope.val"></scoped-consumer></scoped-ctx><h2>6. @@ Escape (Literal @)</h2><app-counter-ctx value="10"><app-text-ctx value="@@some-text"><app-flag-ctx value="false"><ctx-ref-consumer label="Escape Test" count="10" text="@@some-text" flag="false" ></ctx-ref-consumer></app-flag-ctx></app-text-ctx></app-counter-ctx></div>`)

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
// Register the custom elements first, then hand TestContextRefHtml —
// the component that carries .test — to TestSnapshots.
export default () => {
    registerCustomElements()
    return <TestSnapshots Component={TestContextRefHtml} />
}