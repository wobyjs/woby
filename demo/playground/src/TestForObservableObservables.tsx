import { $, $$, For, Observable, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestForObservableObservables = (): JSX.Element => {
    const v1 = $(1)
    const v2 = $(2)
    const v3 = $(3)
    const v4 = $(4)
    const v5 = $(5)
    const values = $([v1, v2, v3, v4, v5])
    // Remove dynamic updates for static test
    const ret: JSX.Element = () => (
        <>
            <h3>For - Observable Observables</h3>
            <For values={values}>
                {(value: Observable<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForObservableObservables_ssr', ret)

    return ret
}

TestForObservableObservables.test = {
    static: true,
    expect: () => {
        // For static test, return the fixed values
        const expected = `<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p><p>Value: 4</p><p>Value: 5</p>`

        const ssrComponent = testObservables['TestForObservableObservables_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>For - Observable Observables</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestForObservableObservables] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestForObservableObservables] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestForObservableObservables} />