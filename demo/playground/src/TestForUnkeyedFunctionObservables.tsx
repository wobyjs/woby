import { $, $$, For, ObservableReadonly, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const name = 'TestForUnkeyedFunctionObservables'
const TestForUnkeyedFunctionObservables = (): JSX.Element => {
    const v1 = $(1)
    const v2 = $(2)
    const v3 = $(3)
    const values = [v1, v2, v3]
    // Remove dynamic updates for static test
    const ret: JSX.Element = () => (
        <>
            <h3>For - Unkeyed - Function Observables</h3>
            <For values={() => values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestForUnkeyedFunctionObservables.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>For - Unkeyed - Function Observables</h3><p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'
        const expected = '<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        // For static test, return the fixed values
        return expected
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedFunctionObservables} />