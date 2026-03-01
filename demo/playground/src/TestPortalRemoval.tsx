import { $, $$, Portal, If, renderToString } from 'woby'
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

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestPortalRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestPortalRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestPortalRemoval] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalRemoval} />