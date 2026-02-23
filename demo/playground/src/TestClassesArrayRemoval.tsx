import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesArrayRemoval = (): JSX.Element => {
    const o = $<FunctionUnwrap<JSX.Class> | null>(['red', false])
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesArrayRemoval', o)
    const toggle = () => o(prev => prev ? null : ['red', false])
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Classes - Array Removal</h3>
            <p class={o}>content</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayRemoval_ssr', ret)
    
    return ret
}

TestClassesArrayRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayRemoval'])
        let expected: string
        if (!value) expected = '<p class="">content</p>'
        else {
            const classes = Array.isArray(value) ? value.filter(v => v && v !== false).join(' ') : value
            expected = `<p class="${classes}">content</p>`
        }
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestClassesArrayRemoval_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = value ? `<h3>Classes - Array Removal</h3>${expected}` : '<h3>Classes - Array Removal</h3><p>content</p>'
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


export default () => <TestSnapshots Component={TestClassesArrayRemoval} />