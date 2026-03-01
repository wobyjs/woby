import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestNumberStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Number - Static</h3>
            <p>{123}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestNumberStatic_ssr', ret)

    return ret
}

TestNumberStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Number - Static</h3><p>123</p>'  // For SSR comparison
        const expected = '<p>123</p>'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestNumberStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestNumberStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestNumberStatic] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestNumberStatic} />