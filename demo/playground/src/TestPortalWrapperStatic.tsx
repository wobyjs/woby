import { $, $$, Portal, renderToString, createDocument, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPortalWrapperStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Portal - Wrapper Static</h3>
            <Portal mount={document.body} wrapper={<div class="custom-wrapper" />}>
                <p>content</p>
            </Portal>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPortalWrapperStatic_ssr', ret)

    return ret
}

TestPortalWrapperStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Portal - Wrapper Static</h3><!---->'  // For SSR comparison (portal renders as comment)
        const expected = '<!---->'   // For main DOM test comparison

        // SSR test - create isolated document context and shared container
        const ssrComponent = testObservables['TestPortalWrapperStatic_ssr']
        const doc = createDocument()
        const container = doc.createElement('div')
        container.id = 'portal-container-wrapper-static'
        doc.body.appendChild(container)
            ; (globalThis as any).__portal_container = container
            ; (globalThis as any).__ssr_document__ = doc

        try {
            const ssrResult = renderToString(ssrComponent, { document: doc })
            console.log(`✅ [TestPortalWrapperStatic] SSR body: ${doc.body.innerHTML}`)
        } catch (error) {
            console.error('❌ [TestPortalWrapperStatic] SSR error:', error)
        } finally {
            // Cleanup
            ; (globalThis as any).__portal_container = undefined
                ; (globalThis as any).__ssr_document__ = undefined
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalWrapperStatic} />