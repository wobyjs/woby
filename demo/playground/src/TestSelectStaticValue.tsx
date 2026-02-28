import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSelectStaticValue = (): JSX.Element => {
    const ref = $<HTMLSelectElement>()
    const assert = () => console.assert(ref()?.value === 'bar')
    useTimeout(assert, 1)
    const ret: JSX.Element = (
        <>
            <h3>Select - Static Value</h3>
            <select ref={ref} name="select-static-value" value="bar">
                <option value="foo">foo</option>
                <option value="bar">bar</option>
                <option value="baz">baz</option>
                <option value="qux">qux</option>
            </select>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSelectStaticValue_ssr', ret)

    return ret
}

TestSelectStaticValue.test = {
    static: true,
    expect: () => {
        const expected = '<select name="select-static-value"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSelectStaticValue_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Select - Static Value</h3><select name="select-static-value"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSelectStaticValue] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSelectStaticValue] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSelectStaticValue] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSelectStaticValue} />