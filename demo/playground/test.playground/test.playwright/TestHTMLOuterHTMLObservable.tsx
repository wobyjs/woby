import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestHTMLOuterHTMLObservable = (): JSX.Element => {
    const o = $('<b>danger1</b>')
    const toggle = () => o(prev => (prev === '<b>danger1</b>') ? '<b>danger2</b>' : '<b>danger1</b>')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>HTML - outerHTML - Observable</h3>
            <p outerHTML={o} />
        </>
    )
}

TestHTMLOuterHTMLObservable.test = {
    static: true,
    expect: () => '<p></p>'
}


export default () => <TestSnapshots Component={TestHTMLOuterHTMLObservable} />