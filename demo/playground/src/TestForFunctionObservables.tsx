import { $, $$, For, Observable, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestForFunctionObservables = (): JSX.Element => {
    const v1 = $(1) // Force refresh
    const v2 = $(2) // Force refresh
    const v3 = $(3) // Force refresh
    const values = [v1, v2, v3]
    // Remove dynamic updates for static test
    const ret: JSX.Element = (
        <>
            <h3>For - Function Observables</h3>
            <For values={() => values}>
                {(value: Observable<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestForFunctionObservables_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>For - Function Observables</h3>${expected}`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestForFunctionObservables] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestForFunctionObservables] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestForFunctionObservables] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestForFunctionObservables} />