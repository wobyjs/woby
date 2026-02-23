import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassNameFunction = (): JSX.Element => {
    const o = $('red')
    registerTestObservable('TestClassNameFunction', o)
    const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>ClassName - Function</h3>
            <p class={() => o()}>content</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestClassNameFunction_ssr', ret)
    
    return ret
}

TestClassNameFunction.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestClassNameFunction'])
        
        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>ClassName - Function</h3><p class="${value}">content</p>`  // For SSR comparison
        const expected = `<p class="${value}">content</p>`   // For main test comparison
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestClassNameFunction_ssr']
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


export default () => <TestSnapshots Component={TestClassNameFunction} />