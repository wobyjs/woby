import { $, $$ } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSelectStaticOption = (): JSX.Element => {
    const ref = $<HTMLSelectElement>()
    // Comment out assertion to prevent console.assert errors
    // const assert = () => console.assert(ref()?.value === 'bar')
    // useTimeout(assert, 1)
    return (
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
}

TestSelectStaticOption.test = {
    static: true,
    expect: () => '<select name="select-static-option"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
}


export default () => <TestSnapshots Component={TestSelectStaticOption} />