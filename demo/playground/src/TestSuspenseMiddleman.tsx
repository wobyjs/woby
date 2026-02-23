import { $, $$, Suspense, useResource, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSuspenseMiddleman = (): JSX.Element => {
    const Content = () => {
        return <p>Middleman!</p>  // Static content
    }
    const ret: JSX.Element = (
        <>
            <h3>Suspense - Middleman</h3>
            <Suspense fallback={<p>Loading...</p>}>
                <Content />
            </Suspense>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestSuspenseMiddleman_ssr', ret)
    
    return ret
}

TestSuspenseMiddleman.test = {
    static: true,
    expect: () => {
        const expected = '<p>Middleman!</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSuspenseMiddleman_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Suspense - Middleman</h3><p>Middleman!</p>'
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


export default () => <TestSnapshots Component={TestSuspenseMiddleman} />