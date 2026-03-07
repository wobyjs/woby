import { $, $$, For, Observable, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestForObservables = (): JSX.Element => {
    const v1 = $(1)
    const v2 = $(2)
    const v3 = $(3)
    const values = [v1, v2, v3]
    // Remove dynamic updates for static test
    const ret: JSX.Element = () => (
        <>
            <h3>For - Observables</h3>
            <For values={values}>
                {(value: Observable<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForObservables_ssr', ret)

    return ret
}

TestForObservables.test = {
    static: true,
    expect: () => {
        // For static test, return the fixed values
        const expected = `<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>`

        const ssrComponent = testObservables['TestForObservables_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>For - Observables</h3><p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestForObservables] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestForObservables] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForObservables} />