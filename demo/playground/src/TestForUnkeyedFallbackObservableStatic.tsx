import { $, $$, For, ObservableReadonly, renderToString } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, assert } from './util'

const TestForUnkeyedFallbackObservableStatic = (): JSX.Element => {
    const Fallback = () => {
        return (
            <>
                <p>Fallback: 0.123456</p>
            </>
        )
    }
    const ret: JSX.Element = (
        <>
            <h3>For - Unkeyed - Fallback Observable Static</h3>
            <For values={[]} fallback={<Fallback />} unkeyed>
                {(value: ObservableReadonly<unknown> | ObservableReadonly<any>) => {
                    return <p>Value: {String(value)}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForUnkeyedFallbackObservableStatic_ssr', ret)

    return ret
}

TestForUnkeyedFallbackObservableStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>For - Unkeyed - Fallback Observable Static</h3><p>Fallback: 0.123456</p>'
        const expected = '<p>Fallback: 0.123456</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestForUnkeyedFallbackObservableStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestForUnkeyedFallbackObservableStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestForUnkeyedFallbackObservableStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestForUnkeyedFallbackObservableStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedFallbackObservableStatic} />