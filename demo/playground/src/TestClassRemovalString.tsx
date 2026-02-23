import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassRemovalString = (): JSX.Element => {
    const o = $<string | null>('red')
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassRemovalString', o)
    const toggle = () => o(prev => prev ? null : 'red')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Class - Removal String</h3>
            <p class={o}>content</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestClassRemovalString_ssr', ret)
    
    return ret
}

TestClassRemovalString.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassRemovalString'])
        const expected = value ? `<p class="${value}">content</p>` : '<p class="">content</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestClassRemovalString_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = value ? `<h3>Class - Removal String</h3><p class="${value}">content</p>` : '<h3>Class - Removal String</h3><p>content</p>'
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


export default () => <TestSnapshots Component={TestClassRemovalString} />