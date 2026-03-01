import { $, $$, Portal, renderToString } from 'woby'
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

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestPortalWrapperStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestPortalWrapperStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestPortalWrapperStatic] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalWrapperStatic} />