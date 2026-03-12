import { $, $$, Portal, renderToString, createDocument, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPortalWrapperStatic = (): JSX.Element => {
    const ret: JSX.Element = (props?: { mount?: Element }) => (
        <>
            <h3>Portal - Wrapper Static</h3>
            <Portal mount={props?.mount ?? document.body} wrapper={<div class="custom-wrapper" />}>
                <p>content for TestPortalWrapperStatic "Portal - Wrapper Static"</p>
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
        const expectedFull = '<h3>Portal - Wrapper Static</h3><div id="portal-container-wrapper-static"></div><div class="custom-wrapper"><p>content for TestPortalWrapperStatic "Portal - Wrapper Static"</p></div>'  // For SSR comparison (portal renders as comment)
        const expected = '<!---->'   // For main DOM test comparison

        // SSR test - create isolated document context and shared container
        const ssrComponent = testObservables['TestPortalWrapperStatic_ssr']
        const doc = createDocument()
        const container = doc.createElement('div')
        container.id = 'portal-container-wrapper-static'
        doc.body.appendChild(container)

        const SsrComponent = ssrComponent as any
        const ssrResult = renderToString(<SsrComponent mount={doc.body} />, { document: doc })
        console.log(`✅ [TestPortalWrapperStatic] SSR body: ${doc.body.innerHTML}`)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestPortalWrapperStatic] SSR mismatch: got \n"${ssrResult}", expected \n"${expectedFull}"`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalWrapperStatic} />

// const SsrComponent = TestPortalWrapperStatic()
// const doc = createDocument()
// const container = doc.createElement('div')
// container.id = 'portal-container-wrapper-static'
// doc.body.appendChild(container)

// console.log(renderToString(<SsrComponent mount={doc.body} />, { document: doc }))