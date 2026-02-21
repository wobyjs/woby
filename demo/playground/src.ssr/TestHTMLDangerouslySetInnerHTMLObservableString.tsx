import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestHTMLDangerouslySetInnerHTMLObservableString = (): JSX.Element => {
    const o = $('<i>danger</i>')
    const toggle = () => o(prev => (prev === '<i>danger</i>') ? '<b>danger</b>' : '<i>danger</i>')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Observable String</h3>
            <p dangerouslySetInnerHTML={{ __html: o }} />
        </>
    )
}

TestHTMLDangerouslySetInnerHTMLObservableString.test = {
    static: false,
    expect: () => '<p><i>danger</i></p>'
}


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLObservableString} />