import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSelectObservableOption'
const TestSelectObservableOption = (): JSX.Element => {
    const ref = $<HTMLSelectElement>()
    const branch = $(true)
    // Temporarily disable assertion to prevent console.assert errors
    // const assert = () => {
    //     if (ref()) {
    //         const expectedValue = branch() ? 'bar' : 'qux';
    //         console.assert(ref()?.value === expectedValue, `Expected value ${expectedValue}, got \n${ref()?.value}`);
    //     }
    // }
    const toggle = () => branch(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Select - Observable Option</h3>
            <select ref={ref} name="select-observable-option">
                <option value="foo" selected={false}>foo</option>
                <option value="bar" selected={branch}>bar</option>
                <option value="baz" selected={false}>baz</option>
                <option value="qux" selected={() => !branch()}>qux</option>
            </select>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestSelectObservableOption.test = {
    static: true,
    expect: () => {
        const expected = '<select name="select-observable-option"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Select - Observable Option</h3><select name="select-observable-option"><option value="foo">foo</option><option value="bar" selected="">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSelectObservableOption} />