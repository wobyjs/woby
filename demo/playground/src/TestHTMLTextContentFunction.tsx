import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestHTMLTextContentFunction = (): JSX.Element => {
    const o = $('<b>danger1</b>')
    const toggle = () => o(prev => (prev === '<b>danger1</b>') ? '<b>danger2</b>' : '<b>danger1</b>')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>HTML - textContent - Function</h3>
            <p textContent={() => o()} />
        </>
    )
}

TestHTMLTextContentFunction.test = {
    static: true,
    expect: () => '<p></p>'
}


export default () => <TestSnapshots Component={TestHTMLTextContentFunction} />