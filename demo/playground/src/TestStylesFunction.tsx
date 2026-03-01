import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStylesFunction = (): JSX.Element => {
    const styles = { color: 'orange', fontWeight: 'normal' }  // Static value
    const ret: JSX.Element = () => (
        <>
            <h3>Styles - Function</h3>
            <p style={styles}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStylesFunction_ssr', ret)

    return ret
}

TestStylesFunction.test = {
    static: true,
    expect: () => {
        const expected = '<p style="color: orange; font-weight: normal;">content</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestStylesFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Styles - Function</h3><p style="color: orange; font-weight: normal;">content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStylesFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestStylesFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStylesFunction} />