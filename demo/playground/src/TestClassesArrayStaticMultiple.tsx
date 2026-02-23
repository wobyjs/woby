import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesArrayStaticMultiple = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>Classes - Array Static Multiple</h3>
            <p class={['red bold']}>content</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayStaticMultiple_ssr', ret)
    
    return ret
}

TestClassesArrayStaticMultiple.test = {
    static: true,
    expect: () => {
        const expected = '<p class="red bold">content</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestClassesArrayStaticMultiple_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Classes - Array Static Multiple</h3>${expected}`
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


export default () => <TestSnapshots Component={TestClassesArrayStaticMultiple} />