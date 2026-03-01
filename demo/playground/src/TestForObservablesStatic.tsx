import { $, $$, For, Observable, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestForObservablesStatic = (): JSX.Element => {
    const v1 = $(1)
    const v2 = $(2)
    const v3 = $(3)
    const values = [v1, v2, v3]
    useInterval(() => {
        v1((v1() + 1) % 5)
        v2((v2() + 1) % 5)
        v3((v3() + 1) % 5)
    }, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>For - Observables Static</h3>
            <For values={values}>
                {(value: Observable<number>) => {
                    value()
                    return <p>Value: {value()}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForObservablesStatic_ssr', ret)

    return ret
}

TestForObservablesStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'

        const ssrComponent = testObservables['TestForObservablesStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>For - Observables Static</h3><p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestForObservablesStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestForObservablesStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForObservablesStatic} />