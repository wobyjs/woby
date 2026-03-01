import { $, $$, For, ObservableReadonly, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestForUnkeyedStatic = (): JSX.Element => {
    const values = [1, 2, 3]
    const ret: JSX.Element = () => (
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

        const ssrComponent = testObservables['TestForUnkeyedStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestForUnkeyedStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestForUnkeyedStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedStatic} />