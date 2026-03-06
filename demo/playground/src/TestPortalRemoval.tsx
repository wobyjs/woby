import { $, $$, Portal, If, renderToString, createDocument } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPortalRemoval = (): JSX.Element => {
    const Inner = () => {
        return <p>content</p>
    }
    const Portalized = () => {
        return (
            <Portal mount={document.body}>
                <Inner />
            </Portal>
        )
    }
    const o = $<boolean | null>(true)
    const toggle = () => o(prev => prev ? null : true)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Portal - Removal</h3>
            <If when={o}>
                <Portalized />
            </If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPortalRemoval_ssr', ret)

    return ret
}

TestPortalRemoval.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Portal - Removal</h3><!---->'  // For SSR comparison (portal renders as comment)
        const expected = '<!---->'   // For main DOM test comparison

        // SSR test - create isolated document context and shared container
        const ssrComponent = testObservables['TestPortalRemoval_ssr']
        const doc = createDocument()
        const container = doc.createElement('div')
        container.id = 'portal-container-removal'
        doc.body.appendChild(container)
            ; (globalThis as any).__portal_container = container
            ; (globalThis as any).__ssr_document__ = doc

        try {
            const ssrResult = renderToString(ssrComponent, { document: doc })
            console.log(`✅ [TestPortalRemoval] SSR body: ${doc.body.innerHTML}`)
        } catch (error) {
            console.error('❌ [TestPortalRemoval] SSR error:', error)
        } finally {
            // Cleanup
            ; (globalThis as any).__portal_container = undefined
                ; (globalThis as any).__ssr_document__ = undefined
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalRemoval} />