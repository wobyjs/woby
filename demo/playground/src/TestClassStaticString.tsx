import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassStaticString = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Class - Static String</h3>
            <p class="red">content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassStaticString_ssr', ret)

    return ret
}

TestClassStaticString.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Class - Static String</h3><p class="red">content</p>'  // For SSR comparison
        const expected = '<p class="red">content</p>'   // For main test comparison

        const ssrComponent = testObservables['TestClassStaticString_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassStaticString] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestClassStaticString] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassStaticString} />