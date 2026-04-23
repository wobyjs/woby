import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSelectStaticValue'
const TestSelectStaticValue = (): JSX.Element => {
    const ref = $<HTMLSelectElement>()
    // const assert = () => console.assert(ref()?.value === 'bar')
    // useTimeout(assert, 1)
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestSelectStaticValue()
    const ssrComponent = testObservables[`TestSelectStaticValue_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestSelectStaticValue\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestSelectStaticValue.test = {
    static: true,
    expect: () => {
        const expected = '<select name="select-static-value"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Select - Static Value</h3><select name="select-static-value" value="bar"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSelectStaticValue} />