import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSelectStaticValue = (): JSX.Element => {
    const ref = $<HTMLSelectElement>()
    const assert = () => console.assert(ref()?.value === 'bar')
    useTimeout(assert, 1)
    const ret: JSX.Element = () => (
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

        const ssrComponent = testObservables['TestSelectStaticValue_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Select - Static Value</h3><select name="select-static-value"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSelectStaticValue] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSelectStaticValue] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSelectStaticValue} />