import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestNullStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Null - Static</h3>
            <p>{null}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestNullStatic_ssr', ret)

    return ret
}

TestNullStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Null - Static</h3><p></p>'  // For SSR comparison (null renders as empty paragraph)
        const expected = '<p></p>'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestNullStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestNullStatic] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestNullStatic] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestNullStatic} />