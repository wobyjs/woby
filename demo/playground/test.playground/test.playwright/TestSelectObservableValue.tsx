import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSelectObservableValue = (): JSX.Element => {
    const ref = $<HTMLSelectElement>()
    const value = $('bar')
    const assert = () => console.assert(ref()?.value === value())
    const toggle = () => value(prev => prev === 'bar' ? 'qux' : 'bar')
    useInterval(toggle, TEST_INTERVAL)
    useInterval(assert, TEST_INTERVAL)
    useTimeout(assert, 1)
    return (
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
}

TestSelectObservableValue.test = {
    static: true,
    expect: () => '<select name="select-observable-value"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
}


export default () => <TestSnapshots Component={TestSelectObservableValue} />