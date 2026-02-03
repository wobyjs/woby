import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestHTMLInnerHTMLStatic = (): JSX.Element => {
    return (
        <>
            <h3>HTML - innerHTML - Static</h3>
            <p innerHTML="<b>danger</b>" />
        </>
    )
}

TestHTMLInnerHTMLStatic.test = {
    static: true,
    expect: () => '<p></p>'
}


export default () => <TestSnapshots Component={TestHTMLInnerHTMLStatic} />