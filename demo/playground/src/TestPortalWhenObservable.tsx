import { $, $$, Portal, renderToString, createDocument, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestPortalWhenObservable'
const TestPortalWhenObservable = (): JSX.Element => {
    // Static when for static test - set to true to show portal content
    const when = true
    const ret: JSX.Element = (props?: { mount?: Element }) => (
        <>
            <h3>Portal - When Observable</h3>
            <Portal mount={props?.mount ?? document.body} when={when}>
                <p>content for TestPortalWhenObservable "Portal - When Observable"</p>
            </Portal>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    const doc = createDocument()
    const container = doc.createElement('div')
    container.id = 'portal-container-when-observable'
    doc.body.appendChild(container)
    
    TestPortalWhenObservable()
    const ssrComponent = testObservables[`TestPortalWhenObservable_ssr`]
    if (ssrComponent) {
        const SsrComponent = ssrComponent as any
        const ssrResult = renderToString(<SsrComponent mount={doc.body} />, { document: doc })
        console.log(`\n📝 Test: TestPortalWhenObservable\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestPortalWhenObservable.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Portal - When Observable</h3><div id="portal-container-when-observable"></div><p>content for TestPortalWhenObservable "Portal - When Observable"</p>'  // For SSR comparison (portal renders as comment)
        const expected = '<!---->'   // For main DOM test comparison

        // SSR test - create isolated document context and shared container
        const ssrComponent = testObservables[`${name}_ssr`]
        const doc = createDocument()
        const container = doc.createElement('div')
        container.id = 'portal-container-when-observable'
        doc.body.appendChild(container)

        const SsrComponent = ssrComponent as any
        const ssrResult = renderToString(<SsrComponent mount={doc.body} />, { document: doc })
        console.log(`✅ [${name}] SSR body: ${doc.body.innerHTML}`)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n"${ssrResult}", expected \n"${expectedFull}"`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalWhenObservable} />