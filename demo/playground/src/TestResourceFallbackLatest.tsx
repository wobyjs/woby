import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestResourceFallbackLatest = (): JSX.Element => {
    const resource = useResource(() => { throw new Error('Some error') })
    const ret: JSX.Element = (
        <>
            <h3>Resource - Fallback Latest</h3>
            <ErrorBoundary fallback={<p>Error!</p>}>
                <If when={() => resource().latest} fallback={<p>Loading!</p>}>
                    <p>Loaded!</p>
                </If>
            </ErrorBoundary>
            <ErrorBoundary fallback={<p>Error!</p>}>
                <If when={resource.latest} fallback={<p>Loading!</p>}>
                    <p>Loaded!</p>
                </If>
            </ErrorBoundary>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestResourceFallbackLatest_ssr', ret)
    
    return ret
}

TestResourceFallbackLatest.test = {
    static: true,
    expect: () => {
        const expected = '<p>Error!</p><p>Error!</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestResourceFallbackLatest_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Resource - Fallback Latest</h3><p>Error!</p><p>Error!</p>'
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


export default () => <TestSnapshots Component={TestResourceFallbackLatest} />