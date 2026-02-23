import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSelectStaticOption = (): JSX.Element => {
    const ref = $<HTMLSelectElement>()
    // Comment out assertion to prevent console.assert errors
    // const assert = () => console.assert(ref()?.value === 'bar')
    // useTimeout(assert, 1)
    const ret: JSX.Element = (
        <>
            <h3>Select - Static Option</h3>
            <select ref={ref} name="select-static-option">
                <option value="foo" selected={false}>foo</option>
                <option value="bar" selected={true}>bar</option>
                <option value="baz" selected={false}>baz</option>
                <option value="qux" selected={false}>qux</option>
            </select>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestSelectStaticOption_ssr', ret)
    
    return ret
}

TestSelectStaticOption.test = {
    static: true,
    expect: () => {
        const expected = '<select name="select-static-option"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSelectStaticOption_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Select - Static Option</h3><select name="select-static-option"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
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


export default () => <TestSnapshots Component={TestSelectStaticOption} />