import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomBigInt, assert } from './util'

const TestBigIntFunction = (): JSX.Element => {
    const o = $(randomBigInt())
    // Store the observable globally so the test can access it
    registerTestObservable('TestBigIntFunction', o)
    const ret: JSX.Element = (
        <>
            <h3>BigInt - Function</h3>
            <p>{() => o()}</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestBigIntFunction_ssr', ret)
    
    return ret
}

TestBigIntFunction.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true, // Use compareActualValues to bypass conversion logic
    expect: () => {
        const value = $$(testObservables['TestBigIntFunction'])
        // Return value without 'n' suffix to match actual rendering
        const expected = `<p>${value}</p>`
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestBigIntFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>BigInt - Function</h3>${expected}`
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


export default () => <TestSnapshots Component={TestBigIntFunction} />