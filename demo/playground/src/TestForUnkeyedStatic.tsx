import { $, $$, For, ObservableReadonly, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestForUnkeyedStatic = (): JSX.Element => {
    const values = [1, 2, 3]
    const ret: JSX.Element = (
        <>
            <h3>For - Unkeyed - Static</h3>
            <For values={values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForUnkeyedStatic_ssr', ret)

    return ret
}

TestForUnkeyedStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>For - Unkeyed - Static</h3><p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'
        const expected = '<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestForUnkeyedStatic_ssr']
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

        return expected
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedStatic} />