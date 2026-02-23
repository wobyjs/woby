import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestRefUntrack = (): JSX.Element => {
    const o = $(0)
    const increment = () => o(prev => prev + 1)
    useInterval(increment, TEST_INTERVAL)

    const Reffed = hmr(() => { }, (): JSX.Element => {
        const ref = element => element.textContent = o()
        return <p ref={ref}>content</p>
    })

    const ret: JSX.Element = (
        <>
            <h3>Ref - Untrack</h3>
            <Reffed />
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestRefUntrack_ssr', ret)
    
    return ret
}

TestRefUntrack.test = {
    static: true,
    expect: () => {
        const expected = '<p>0</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestRefUntrack_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Ref - Untrack</h3><p>0</p>'
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


export default () => <TestSnapshots Component={TestRefUntrack} />