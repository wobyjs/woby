import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestInputForm = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Input - Input Form</h3>
            <input form={undefined} />
            <input form={null} />
            <input form="foo" />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestInputForm_ssr', ret)

    return ret
}

TestInputForm.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Input - Input Form</h3><input><input><input form="foo">'  // For SSR comparison
        const expected = '<input><input><input form="foo">'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestInputForm_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestInputForm] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestInputForm] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestInputForm} />