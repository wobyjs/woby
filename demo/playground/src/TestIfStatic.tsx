import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestIfStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>If - Static</h3>
            <If when={true}>
                <p>true</p>
            </If>
            <If when={false}>
                <p>false</p>
            </If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIfStatic_ssr', ret)

    return ret
}

TestIfStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>If - Static</h3><p>true</p>'  // For SSR comparison
        const expected = '<p>true</p>'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestIfStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestIfStatic] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestIfStatic] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestIfStatic} />