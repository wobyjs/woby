import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestHTMLDangerouslySetInnerHTMLStatic = (): JSX.Element => {
    return (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Static</h3>
            <p dangerouslySetInnerHTML={{ __html: '<i>danger</i>' }} />
        </>
    )
}

TestHTMLDangerouslySetInnerHTMLStatic.test = {
    static: true,
    expect: () => '<p><i>danger</i></p>'
}


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLStatic} />