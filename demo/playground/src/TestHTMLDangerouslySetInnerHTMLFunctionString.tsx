import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestHTMLDangerouslySetInnerHTMLFunctionString = (): JSX.Element => {
    // Static value for static test
    return (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Function String</h3>
            <p dangerouslySetInnerHTML={{ __html: '<i>danger</i>' }} />
        </>
    )
}

TestHTMLDangerouslySetInnerHTMLFunctionString.test = {
    static: true,
    expect: () => '<p><i>danger</i></p>'
}


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLFunctionString} />