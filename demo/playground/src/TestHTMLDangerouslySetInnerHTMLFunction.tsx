import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestHTMLDangerouslySetInnerHTMLFunction = (): JSX.Element => {
    // Static value for static test
    const htmlContent = { __html: '<i>danger</i>' }
    return (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Function</h3>
            <p dangerouslySetInnerHTML={() => htmlContent} />
        </>
    )
}

TestHTMLDangerouslySetInnerHTMLFunction.test = {
    static: true,
    expect: () => '<p><i>danger</i></p>'
}


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLFunction} />