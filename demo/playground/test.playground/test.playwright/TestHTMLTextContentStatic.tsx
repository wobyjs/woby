import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestHTMLTextContentStatic = (): JSX.Element => {
    return (
        <>
            <h3>HTML - textContent - Static</h3>
            <p textContent="<b>danger</b>" />
        </>
    )
}

TestHTMLTextContentStatic.test = {
    static: true,
    expect: () => '<p></p>'
}


export default () => <TestSnapshots Component={TestHTMLTextContentStatic} />