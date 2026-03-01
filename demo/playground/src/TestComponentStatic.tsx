import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestComponentStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Component - Static</h3>
            <p>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestComponentStatic_ssr', ret)

    return ret
}

TestComponentStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Component - Static</h3><p>content</p>'  // For SSR comparison
        const expected = '<p>content</p>'   // For main test comparison

        const ssrComponent = testObservables['TestComponentStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestComponentStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestComponentStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestComponentStatic} />