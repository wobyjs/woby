import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSelectObservableOption = (): JSX.Element => {
    const ref = $<HTMLSelectElement>()
    const branch = $(true)
    const assert = () => console.assert(ref()?.value === (branch() ? 'bar' : 'qux'))
    const toggle = () => branch(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    useInterval(assert, TEST_INTERVAL)
    setTimeout(assert, 1)
    return (
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
}

TestSelectObservableOption.test = {
    static: true,
    expect: () => '<select name="select-observable-option"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
}


export default () => <TestSnapshots Component={TestSelectObservableOption} />