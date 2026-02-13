import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSelectStaticValue = (): JSX.Element => {
    const ref = $<HTMLSelectElement>()
    const assert = () => console.assert(ref()?.value === 'bar')
    setTimeout(assert, 1)
    return (
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
}

TestSelectStaticValue.test = {
    static: true,
    expect: () => '<select name="select-static-value"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
}


export default () => <TestSnapshots Component={TestSelectStaticValue} />