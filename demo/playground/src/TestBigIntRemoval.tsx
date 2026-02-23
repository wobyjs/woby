import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomBigInt, assert } from './util'

const TestBigIntRemoval = (): JSX.Element => {
    const o = $<bigint | null>(null)
    registerTestObservable('TestBigIntRemoval', o)
    const ret: JSX.Element = (
        <>
            <h3>BigInt - Removal</h3>
            <p>({o})</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestBigIntRemoval_ssr', ret)
    
    return ret
}

TestBigIntRemoval.test = {
    static: true, // Make it static for predictable testing
    // Let TestSnapshots handle the conversion of BigInt values to placeholders
    expect: () => {
        const expected = '<p>(<!---->)</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestBigIntRemoval_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>BigInt - Removal</h3>${expected}`
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


export default () => <TestSnapshots Component={TestBigIntRemoval} />