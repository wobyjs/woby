import { $, $$, Ternary, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestTernaryFunction = (): JSX.Element => {
    const o = $(true)
    registerTestObservable('TestTernaryFunction', o)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Ternary - Function</h3>
            <Ternary when={() => !o()}>
                <p>true</p>
                <p>false</p>
            </Ternary>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestTernaryFunction_ssr', ret)
    
    return ret
}

TestTernaryFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = !testObservables['TestTernaryFunction']?.() // since it uses !o()
        const expected = `<p>${value ? 'true' : 'false'}</p>`
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestTernaryFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Ternary - Function</h3><p>${value ? 'true' : 'false'}</p>`
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


export default () => <TestSnapshots Component={TestTernaryFunction} />