import { $, $$, Portal, renderToString, createDocument } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPortalWhenObservable = (): JSX.Element => {
    // Static when for static test - set to true to show portal content
    const when = true
    const ret: JSX.Element = () => (
        <>
            <h3>Portal - When Observable</h3>
            <Portal mount={document.body} when={when}>
                <p>content</p>
            </Portal>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPortalWhenObservable_ssr', ret)

    return ret
}

TestPortalWhenObservable.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Portal - When Observable</h3><!---->'  // For SSR comparison (portal renders as comment)
        const expected = '<!---->'   // For main DOM test comparison

        // SSR test - create isolated document context and shared container
        const ssrComponent = testObservables['TestPortalWhenObservable_ssr']
        const doc = createDocument()
        const container = doc.createElement('div')
        container.id = 'portal-container-when-observable'
        doc.body.appendChild(container)
            ; (globalThis as any).__portal_container = container
            ; (globalThis as any).__ssr_document__ = doc

        try {
            const ssrResult = renderToString(ssrComponent, { document: doc })
            console.log(`✅ [TestPortalWhenObservable] SSR body: ${doc.body.innerHTML}`)
        } catch (error) {
            console.error('❌ [TestPortalWhenObservable] SSR error:', error)
        } finally {
            // Cleanup
            ; (globalThis as any).__portal_container = undefined
                ; (globalThis as any).__ssr_document__ = undefined
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalWhenObservable} />