import { $, $$, For, ObservableReadonly, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestForUnkeyedObservablesStatic = (): JSX.Element => {
    const v1 = $(1)
    const v2 = $(2)
    const v3 = $(3)
    const values = [v1, v2, v3]
    useInterval(() => {
        v1((v1() + 1) % 5)
        v2((v2() + 1) % 5)
        v3((v3() + 1) % 5)
    }, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>For - Unkeyed - Observables Static</h3>
            <For values={values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    value()
                    return <p>Value: {value()}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForUnkeyedObservablesStatic_ssr', ret)

    return ret
}

TestForUnkeyedObservablesStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>For - Unkeyed - Observables Static</h3><p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'
        const expected = '<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestForUnkeyedObservablesStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestForUnkeyedObservablesStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestForUnkeyedObservablesStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestForUnkeyedObservablesStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedObservablesStatic} />