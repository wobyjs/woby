import { $, $$, store, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let testit = true
const TestClassesArrayStoreMultiple = (): JSX.Element => {
    const o = $(['red bold', false])
    registerTestObservable('TestClassesArrayStoreMultiple', o)
    const toggle = () => {
        if (o[0]) {
            o[0] = false
            o[1] = 'blue'
        } else {
            o[0] = 'red bold'
            o[1] = false
        }
        testit = false
    }
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Classes - Array Store Multiple</h3>
            <p class={o}>content</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayStoreMultiple_ssr', ret)
    
    return ret
}

TestClassesArrayStoreMultiple.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        // For static test, just return the initial state
        const expected = '<p class="red bold">content</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestClassesArrayStoreMultiple_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Classes - Array Store Multiple</h3>${expected}`
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


export default () => <TestSnapshots Component={TestClassesArrayStoreMultiple} />