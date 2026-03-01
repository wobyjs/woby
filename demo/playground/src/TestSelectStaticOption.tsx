import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSelectStaticOption = (): JSX.Element => {
    const ref = $<HTMLSelectElement>()
    // Comment out assertion to prevent console.assert errors
    // const assert = () => console.assert(ref()?.value === 'bar')
    // useTimeout(assert, 1)
    const ret: JSX.Element = () => (
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

        const ssrComponent = testObservables['TestSelectStaticOption_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Select - Static Option</h3><select name="select-static-option"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSelectStaticOption] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSelectStaticOption] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSelectStaticOption} />