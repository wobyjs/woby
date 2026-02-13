import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestHTMLOuterHTMLStatic = (): JSX.Element => {
    return (
        <>
            <h3>HTML - outerHTML - Static</h3>
            <p outerHTML="<b>danger</b>" />
        </>
    )
}

TestHTMLOuterHTMLStatic.test = {
    static: true,
    expect: () => '<p></p>'
}


export default () => <TestSnapshots Component={TestHTMLOuterHTMLStatic} />