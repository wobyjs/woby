import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestNestedIfs'
const TestNestedIfs = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <If when={true}>
                <If when={true}>
                    <div>1</div>
                    <div>2</div>
                </If>
                <div>Footer</div>
            </If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestNestedIfs_ssr', ret)

    return ret
}

TestNestedIfs.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<div>1</div><div>2</div><div>Footer</div>'  // For SSR comparison
        const expected = '<div>1</div><div>2</div><div>Footer</div>'   // For main DOM test comparison

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


export default () => <TestSnapshots Component={TestNestedIfs} />