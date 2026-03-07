import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStylesObservable = (): JSX.Element => {
    const styles = { color: 'orange', fontWeight: 'normal' }  // Static value
    const ret: JSX.Element = () => (
        <>
            <h3>Styles - Observable</h3>
            <p style={styles}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStylesObservable_ssr', ret)

    return ret
}

TestStylesObservable.test = {
    static: true,
    expect: () => {
        const expected = '<p style="color: orange; font-weight: normal;">content</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestStylesObservable_ssr']
        if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
            const ssrResult = renderToString(ssrComponent)
            const expectedFull = '<h3>Styles - Observable</h3><p style="color: orange; font-weight: normal;">content</p>'
            if (ssrResult !== expectedFull) {
                assert(false, `[TestStylesObservable] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
            } else {
                console.log(`✅ [TestStylesObservable] SSR test passed: ${ssrResult}`)
            }
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStylesObservable} />