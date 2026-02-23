import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSelectObservableValue = (): JSX.Element => {
    const ref = $<HTMLSelectElement>()
    const value = $('bar')
    const assert = () => console.assert(ref()?.value === value())
    const toggle = () => value(prev => prev === 'bar' ? 'qux' : 'bar')
    useInterval(toggle, TEST_INTERVAL)
    useInterval(assert, TEST_INTERVAL)
    useTimeout(assert, 1)
    const ret: JSX.Element = (
        <>
            <h3>Select - Observable Value</h3>
            <select ref={ref} name="select-observable-value" value={value}>
                <option value="foo">foo</option>
                <option value="bar">bar</option>
                <option value="baz">baz</option>
                <option value="qux">qux</option>
            </select>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestSelectObservableValue_ssr', ret)
    
    return ret
}

TestSelectObservableValue.test = {
    static: true,
    expect: () => {
        const expected = '<select name="select-observable-value"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSelectObservableValue_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Select - Observable Value</h3><select name="select-observable-value"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
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


export default () => <TestSnapshots Component={TestSelectObservableValue} />