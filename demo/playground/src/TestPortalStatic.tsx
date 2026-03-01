import { $, $$, Portal, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPortalStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Portal - Static</h3>
            <Portal mount={document.body}>
                <p>content</p>
            </Portal>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPortalStatic_ssr', ret)

    return ret
}

TestPortalStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Portal - Static</h3><!---->'  // For SSR comparison (portal renders as comment)
        const expected = '<!---->'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestPortalStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestPortalStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestPortalStatic] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalStatic} />