import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStylesStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Styles - Static</h3>
            <p style={{ color: 'green' }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStylesStatic_ssr', ret)

    return ret
}

TestStylesStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p style="color: green;">content</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestStylesStatic_ssr']
        if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
            const ssrResult = renderToString(ssrComponent)
            const expectedFull = '<h3>Styles - Static</h3><p style="color: green;">content</p>'
            if (ssrResult !== expectedFull) {
                assert(false, `[TestStylesStatic] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
            } else {
                console.log(`✅ [TestStylesStatic] SSR test passed: ${ssrResult}`)
            }
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStylesStatic} />