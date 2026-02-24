import { $, $$, If, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestIfFallbackObservableStatic = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestIfFallbackObservableStatic', initialValue)
    const Fallback = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>Fallback: {initialValue}</p>
    }
    const ret: JSX.Element = (
        <>
            <h3>If - Fallback Observable Static</h3>
            <If when={false} fallback={<Fallback />}>Children</If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIfFallbackObservableStatic_ssr', ret)

    return ret
}

TestIfFallbackObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = testObservables['TestIfFallbackObservableStatic']

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>If - Fallback Observable Static</h3><p>Fallback: ${initialValue}</p>`
        const expected = `<p>Fallback: ${initialValue}</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestIfFallbackObservableStatic_ssr']
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


export default () => <TestSnapshots Component={TestIfFallbackObservableStatic} />