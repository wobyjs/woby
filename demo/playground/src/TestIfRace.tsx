import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestIfRace = () => {
    const data = { deep: 'hi' }  // Static data for static test
    const visible = true  // Static value for static test
    const ret: JSX.Element = () => (
        <>
            <h3>If - Race</h3>
            <If when={visible}>
                <div>{data?.deep || ''}</div>
            </If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIfRace_ssr', ret)

    return ret
}

TestIfRace.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>If - Race</h3><div>hi</div>'  // For SSR comparison
        const expected = '<div>hi</div>'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestIfRace} />