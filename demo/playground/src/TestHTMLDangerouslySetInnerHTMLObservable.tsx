import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestHTMLDangerouslySetInnerHTMLObservable = (): JSX.Element => {
    // Static value for static test
    const htmlContent = { __html: '<i>danger</i>' }
    return (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Observable</h3>
            <p dangerouslySetInnerHTML={htmlContent} />
        </>
    )
}

TestHTMLDangerouslySetInnerHTMLObservable.test = {
    static: true,
    expect: () => '<p><i>danger</i></p>'
}


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLObservable} />