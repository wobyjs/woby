/**
 * Regression test for A1: `style$` attribute path must resolve @-prefix
 * context references instead of writing the literal `@scope.field` string
 * into CSS.
 *
 * Before the fix, `setNestedProperty`'s `style.` early-return wrote the raw
 * attribute string (e.g. "@theme.color") straight into `element.style[prop]`,
 * which the CSSOM rejects — leaving the property empty. After the fix the
 * style path mirrors `setObservableValue`: it resolves the ref, and when the
 * resolved value is an observable it bridges via `effect()` so the CSS
 * property updates when the provider's observable changes.
 *
 * This test is assertion-based (not TestSnapshots) because computed/inline
 * style strings are a poor fit for exact-HTML snapshot matching.
 */
import { $, $$, customElement, defaults, createContext, registerContextRef, useTimeout, HtmlString, type JSX, type ElementAttributes } from 'woby'
import { assert, TEST_INTERVAL } from './util'

// Dedicated context so this test never perturbs TestContextRef's shared contexts.
const ThemeColorCtx = createContext('rgb(0, 0, 0)')
registerContextRef('theme.color', ThemeColorCtx)

declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'style-ref-provider': ElementAttributes<typeof StyleRefProvider>
            'style-ref-consumer': ElementAttributes<typeof StyleRefConsumer>
        }
    }
}

// Provider custom element: establishes the ThemeColorCtx wrap on its DOM node
// (via the invisible JSX Provider + pending-wrap side channel) so slotted
// light-DOM descendants can discover it by walking DOM ancestors.
const StyleRefProvider = defaults(() => ({
    color: $('rgb(0, 0, 0)', HtmlString),
}), ({ color, children }) => {
    return (
        <div data-test="style-ref-provider" style={{ padding: '8px', border: '1px solid gray' }}>
            <ThemeColorCtx.Provider value={color}>
                {children}
            </ThemeColorCtx.Provider>
        </div>
    )
})

// Consumer custom element: the host receives `style$color="@theme.color"`.
const StyleRefConsumer = defaults(() => ({
    label: $('Consumer', HtmlString),
}), ({ label }) => {
    return <div data-test="style-ref-inner">{label}</div>
})

const registerCustomElements = (): void => {
    customElement('style-ref-provider', StyleRefProvider)
    customElement('style-ref-consumer', StyleRefConsumer)
}
registerCustomElements()

const name = 'TestStyleContextRef'
const TestStyleContextRef = (): JSX.Element => {
    const consumerRef = $<HTMLElement>()
    const providerRef = $<HTMLElement>()

    useTimeout(() => {
        const consumer = consumerRef()
        const provider = providerRef()
        if (!consumer || !provider) {
            assert(false, `[${name}] refs not populated (consumer=${!!consumer}, provider=${!!provider})`)
            return
        }

        // Drive the exact A1 path: a style$ attribute holding an @-context-ref,
        // applied after connection so it flows through the per-element
        // MutationObserver -> attributeChangedCallback1 -> setNestedProperty.
        consumer.setAttribute('style$color', '@theme.color')

        // MutationObserver fires on a microtask; assert on a later macrotask.
        setTimeout(() => {
            const resolved = consumer.style.color
            assert(resolved === 'rgb(20, 40, 60)',
                `[${name}] style$ @-ref should resolve to provider color 'rgb(20, 40, 60)', got '${resolved}'`)
            if (resolved === 'rgb(20, 40, 60)') console.log(`✅ [${name}] style$ @-ref resolution passed`)

            // Reactivity: changing the provider's observable (via its attribute)
            // must propagate through the effect bridge to the CSS property.
            provider.setAttribute('color', 'rgb(3, 6, 9)')
            setTimeout(() => {
                const updated = consumer.style.color
                assert(updated === 'rgb(3, 6, 9)',
                    `[${name}] style$ @-ref should update reactively to 'rgb(3, 6, 9)', got '${updated}'`)
                if (updated === 'rgb(3, 6, 9)') console.log(`✅ [${name}] style$ @-ref reactive update passed`)
            }, 250)
        }, 250)
    }, TEST_INTERVAL)

    return () => (
        <div>
            <h1>style$ Context Reference Test</h1>
            <style-ref-provider ref={providerRef} color="rgb(20, 40, 60)">
                <style-ref-consumer ref={consumerRef} label="Styled" />
            </style-ref-provider>
        </div>
    )
}

export default TestStyleContextRef
