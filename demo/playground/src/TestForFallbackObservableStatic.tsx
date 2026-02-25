import { $, $$, For, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestForFallbackObservableStatic = (): JSX.Element => {
    const Fallback = () => {
        const o = $('0.5') // Use fixed value instead of random
        // Store the observable globally so the test can access it
        registerTestObservable('TestForFallbackObservableStatic', o)
        // Remove randomization for static test
        // const randomize = () => o(String(random()))
        // useInterval(randomize, TEST_INTERVAL)
        o()
        return (
            <>
                <p>Fallback: {o()}</p>
            </>
        )
    }
    const ret: JSX.Element = (
        <>
            <h3>For - Fallback Observable Static</h3>
            <For values={[]} fallback={<Fallback />}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForFallbackObservableStatic_ssr', ret)

    return ret
}

TestForFallbackObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const expected = `<p>Fallback: 0.5</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestForFallbackObservableStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>For - Fallback Observable Static</h3>${expected}`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestForFallbackObservableStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestForFallbackObservableStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestForFallbackObservableStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestForFallbackObservableStatic} />