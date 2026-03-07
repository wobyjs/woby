import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassNameStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>ClassName - Static</h3>
            <p class="red">content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassNameStatic_ssr', ret)

    return ret
}

TestClassNameStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>ClassName - Static</h3><p class="red">content</p>'  // For SSR comparison
        const expected = '<p class="red">content</p>'   // For main test comparison

        const ssrComponent = testObservables['TestClassNameStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassNameStatic] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestClassNameStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassNameStatic} />