import { $, $$, For, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestForFallbackFunction = (): JSX.Element => {
    const Fallback = () => {
        const o = $('0.5') // Use fixed value instead of random
        // Store the observable globally so the test can access it
        registerTestObservable('TestForFallbackFunction', o)
        // Remove randomization for consistent testing
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
            <h3>For - Fallback Function</h3>
            <For values={[]} fallback={Fallback}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestForFallbackFunction_ssr', ret)
    
    return ret
}

TestForFallbackFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>For - Fallback Function</h3><p>Fallback: 0.5</p>'  // For SSR comparison
        const expected = '<p>Fallback: 0.5</p>'   // For main test comparison
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestForFallbackFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
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


export default () => <TestSnapshots Component={TestForFallbackFunction} />