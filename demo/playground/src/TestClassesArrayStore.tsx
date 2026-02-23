import { $, $$, renderToString } from 'woby'
import { TestSnapshots, assert,registerTestObservable } from './util'

const TestClassesArrayStore = (): JSX.Element => {
    const o = ['red', false]
    const ret: JSX.Element = (
        <>
            <h3>Classes - Array Store</h3>
            <p class={o}>content</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayStore_ssr', ret)
    
    return ret
}

TestClassesArrayStore.test = {
    static: true,
    expect: () => {
        const expected = '<p class="red">content</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestClassesArrayStore_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Classes - Array Store</h3>${expected}`
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


export default () => <TestSnapshots Component={TestClassesArrayStore} />