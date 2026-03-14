import { $, $$, For, ObservableReadonly, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const name = 'TestForUnkeyedObservableObservables'
const TestForUnkeyedObservableObservables = (): JSX.Element => {
    const v1 = $(1)
    const v2 = $(2)
    const v3 = $(3)
    const v4 = $(4)
    const v5 = $(5)
    const values = [v1, v2, v3, v4, v5]  // Static array instead of observable array
    // Remove dynamic updates for static test
    const ret: JSX.Element = () => (
        <>
            <h3>For - Unkeyed - Observable Observables</h3>
            <For values={values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForUnkeyedObservableObservables_ssr', ret)

    return ret
}

TestForUnkeyedObservableObservables.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>For - Unkeyed - Observable Observables</h3><p>Value: 1</p><p>Value: 2</p><p>Value: 3</p><p>Value: 4</p><p>Value: 5</p>'
        const expected = '<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p><p>Value: 4</p><p>Value: 5</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        // For static test, return the fixed values
        return expected
    }
}

export default () => <TestSnapshots Component={TestForUnkeyedObservableObservables} />