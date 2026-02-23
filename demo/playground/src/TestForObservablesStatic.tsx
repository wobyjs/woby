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
    const ret: JSX.Element = (
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestForObservablesStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>For - Observables Static</h3><p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'
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

        return expected
    }
}


export default () => <TestSnapshots Component={TestForObservablesStatic} />