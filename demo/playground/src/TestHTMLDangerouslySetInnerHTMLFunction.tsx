import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestHTMLDangerouslySetInnerHTMLFunction = (): JSX.Element => {
    const o = $({ __html: '<i>danger</i>' })
    const toggle = () => o(prev => (prev.__html === '<i>danger</i>') ? { __html: '<b>danger</b>' } : { __html: '<i>danger</i>' })
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Function</h3>
            <p dangerouslySetInnerHTML={() => o()} />
        </>
    )
}

TestHTMLDangerouslySetInnerHTMLFunction.test = {
    static: false,
    expect: () => '<p><i>danger</i></p>'
}


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLFunction} />