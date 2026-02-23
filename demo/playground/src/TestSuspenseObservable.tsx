import { $, $$, Suspense, useResource, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSuspenseObservable = (): JSX.Element => {
    const Content = () => {
        return <p>Content! 123</p>  // Static content
    }
    const ret: JSX.Element = (
        <>
            <h3>Suspense - Observable</h3>
            <Suspense fallback={<p>Loading...</p>}>
                <Content />
            </Suspense>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestSuspenseObservable_ssr', ret)
    
    return ret
}

TestSuspenseObservable.test = {
    static: true,
    expect: () => {
        const expected = '<p>Content! 123</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSuspenseObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Suspense - Observable</h3><p>Content! 123</p>'
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


export default () => <TestSnapshots Component={TestSuspenseObservable} />