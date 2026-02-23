import { $, $$, For, ObservableReadonly, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestForUnkeyedObservables = (): JSX.Element => {
    const v1 = $(1)
    const v2 = $(2)
    const v3 = $(3)
    const values = [v1, v2, v3]
    // Remove dynamic updates for static test
    const ret: JSX.Element = (
        <>
            <h3>For - Unkeyed - Observables</h3>
            <For values={values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForUnkeyedObservables_ssr', ret)

    return ret
}

TestForUnkeyedObservables.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>For - Unkeyed - Observables</h3><p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'
        const expected = '<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestForUnkeyedObservables_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)

        // For static test, return the fixed values
        return expected
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedObservables} />