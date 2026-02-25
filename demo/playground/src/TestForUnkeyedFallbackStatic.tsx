import { $, $$, For, ObservableReadonly, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestForUnkeyedFallbackStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>For - Unkeyed - Fallback Static</h3>
            <For values={[]} fallback={<div>Fallback!</div>} unkeyed>
                {(value: ObservableReadonly<unknown> | ObservableReadonly<any>) => {
                    return <p>Value: {String(value)}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForUnkeyedFallbackStatic_ssr', ret)

    return ret
}

TestForUnkeyedFallbackStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>For - Unkeyed - Fallback Static</h3><div>Fallback!</div>'
        const expected = '<div>Fallback!</div>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestForUnkeyedFallbackStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestForUnkeyedFallbackStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestForUnkeyedFallbackStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestForUnkeyedFallbackStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedFallbackStatic} />