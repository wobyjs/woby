import { $, $$, For, Observable, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestForFunctionObservables = (): JSX.Element => {
    const v1 = $(1) // Force refresh
    const v2 = $(2) // Force refresh
    const v3 = $(3) // Force refresh
    const values = [v1, v2, v3]
    // Remove dynamic updates for static test
    const ret: JSX.Element = () => (
        <>
            <h3>For - Function Observables</h3>
            <For values={() => values}>
                {(value: Observable<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
            {/* {values.map(value => <p><span>Value: </span>{value}</p>)} */}
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForFunctionObservables_ssr', ret)

    return ret
}

TestForFunctionObservables.test = {
    static: true,
    expect: () => {
        // For static test, return the fixed values
        const expected = `<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>`

        const ssrComponent = testObservables['TestForFunctionObservables_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>For - Function Observables</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestForFunctionObservables] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestForFunctionObservables] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForFunctionObservables} />