import { $, $$, Portal, If, renderToString, createDocument, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPortalRemoval = (): JSX.Element => {
    const Inner = () => {
        return <p>content</p>
    }
    const o = $<boolean | null>(true)
    const toggle = () => o(prev => prev ? null : true)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (props?: { mount?: Element }) => (
        <>
            <h3>Portal - Removal</h3>
            <If when={o}>
                <Portal mount={props?.mount ?? document.body}>
                    <Inner />
                </Portal>
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
        const expectedFull = '<h3>Portal - Removal</h3><div id="portal-container-removal"></div><p>content</p>'  // For SSR comparison (portal renders as comment)
        const expected = '<!---->'   // For main DOM test comparison

        // SSR test - create isolated document context and shared container
        const ssrComponent = testObservables['TestPortalRemoval_ssr']
        const doc = createDocument()
        const container = doc.createElement('div')
        container.id = 'portal-container-removal'
        doc.body.appendChild(container)

        const SsrComponent = ssrComponent as any
        const ssrResult = renderToString(<SsrComponent mount={doc.body} />, { document: doc })
        // const ssrResult = renderToString(ssrComponent, { document: doc })
        console.log(`✅ [TestPortalRemoval] SSR body: ${doc.body.innerHTML}`)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestPortalRemoval] SSR mismatch: got \n"${ssrResult}", expected \n"${expectedFull}"`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalRemoval} />