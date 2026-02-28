import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestHTMLDangerouslySetInnerHTMLObservable = (): JSX.Element => {
    const o = $({ __html: '<i>danger</i>' })
    const toggle = () => o(prev => (prev.__html === '<i>danger</i>') ? { __html: '<b>danger</b>' } : { __html: '<i>danger</i>' })
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Observable</h3>
            <p dangerouslySetInnerHTML={o} />
        </>
    )
}

TestHTMLDangerouslySetInnerHTMLObservable.test = {
    static: false,
    expect: () => '<p><i>danger</i></p>'
}


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLObservable} />