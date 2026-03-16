import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const name = 'TestHTMLDangerouslySetInnerHTMLFunction'
const TestHTMLDangerouslySetInnerHTMLFunction = (): JSX.Element => {
    // Static value for static test
    const htmlContent = { __html: '<i>danger</i>' }
    const ret: JSX.Element = () => (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Function</h3>
            <p dangerouslySetInnerHTML={() => htmlContent} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestHTMLDangerouslySetInnerHTMLFunction.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>HTML - dangerouslySetInnerHTML - Function</h3><p><i>danger</i></p>'
        const expected = '<p><i>danger</i></p>'

        // const ssrComponent = testObservables[`${name}_ssr`]
        // const ssrResult = renderToString(ssrComponent)
        // if (ssrResult !== expectedFull) {
        //     assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        // } else {
        //     console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        // }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLFunction} />

// console.log(renderToString(<TestHTMLDangerouslySetInnerHTMLFunction />))