import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestHTMLDangerouslySetInnerHTMLObservableString = (): JSX.Element => {
    // Static value for static test
    return (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Observable String</h3>
            <p dangerouslySetInnerHTML={{ __html: '<i>danger</i>' }} />
        </>
    )
}

TestHTMLDangerouslySetInnerHTMLObservableString.test = {
    static: true,
    expect: () => '<p><i>danger</i></p>'
}


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLObservableString} />