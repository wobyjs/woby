import { $, $$, Suspense, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSuspenseNever = (): JSX.Element => {
    const Fallback = () => {
        return <p>Loading...</p>
    }
    const Content = () => {
        return <p>Content!</p>
    }
    const ret: JSX.Element = (
        <>
            <h3>Suspense - Never</h3>
            <Suspense fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestSuspenseNever_ssr', ret)
    
    return ret
}

TestSuspenseNever.test = {
    static: true,
    expect: () => {
        const expected = '<p>Content!</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSuspenseNever_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Suspense - Never</h3><p>Content!</p>'
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


export default () => <TestSnapshots Component={TestSuspenseNever} />