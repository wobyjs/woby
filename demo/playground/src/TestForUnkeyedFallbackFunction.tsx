import { $, $$, For, renderToString, ObservableReadonly } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestForUnkeyedFallbackFunction = (): JSX.Element => {
    const o = $(String(random()))
    // Store the observable globally so the test can access it
    registerTestObservable('TestForUnkeyedFallbackFunction', o)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)
    o()

    const Fallback = () => {
        return (
            <>
                <p>Fallback: {o()}</p>
            </>
        )
    }
    const ret: JSX.Element = (
        <>
            <h3>For - Unkeyed - Fallback Function</h3>
            <For values={[]} fallback={Fallback} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForUnkeyedFallbackFunction_ssr', ret)

    return ret
}

TestForUnkeyedFallbackFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestForUnkeyedFallbackFunction'])
        const expected = `<p>Fallback: ${value}</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestForUnkeyedFallbackFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>For - Unkeyed - Fallback Function</h3><p>Fallback: ${value}</p>`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestForUnkeyedFallbackFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestForUnkeyedFallbackFunction] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestForUnkeyedFallbackFunction] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedFallbackFunction} />