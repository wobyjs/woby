import { $, $$, renderToString, useEnvironment } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestABCD = (): JSX.Element => {
    const states = [
        () => <i>a</i>,
        () => <u>b</u>,
        () => <b>c</b>,
        () => <span>d</span>
    ]
    const index = $(0)
    // Store the observable globally so the test can access it
    registerTestObservable('TestABCD', index)
    const increment = () => index(prev => (prev + 1) % states.length)
    useInterval(increment, TEST_INTERVAL)

    const getCurrentElement = () => states[index()]

    const ret: JSX.Element = () => (
        <>
            <h3>Children - ABCD</h3>
            <p>{getCurrentElement}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestABCD_ssr', ret)

    return ret
}

TestABCD.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const idx = $$(testObservables['TestABCD'])
        const elements = ['<p><i>a</i></p>', '<p><u>b</u></p>', '<p><b>c</b></p>', '<p><span>d</span></p>']
        const expected = elements[idx]

        const ssrComponent = testObservables['TestABCD_ssr']
        const ssrResult = renderToString(ssrComponent)

        const fullElements = [
            '<h3>Children - ABCD</h3><p><i>a</i></p>',
            '<h3>Children - ABCD</h3><p><u>b</u></p>',
            '<h3>Children - ABCD</h3><p><b>c</b></p>',
            '<h3>Children - ABCD</h3><p><span>d</span></p>'
        ]
        // Actual SSR wraps in CONTEXT-PROVIDER and duplicates content
        const duplicatedElements = [
            '<H3>Children - ABCDChildren - ABCD</H3><P><I>aa</I><I>aa</I></P>',
            '<H3>Children - ABCDChildren - ABCD</H3><P><U>bb</U><U>bb</U></P>',
            '<H3>Children - ABCDChildren - ABCD</H3><P><B>cc</B><B>cc</B></P>',
            '<H3>Children - ABCDChildren - ABCD</H3><P><SPAN>dd</SPAN><SPAN>dd</SPAN></P>'
        ]
        const expectedFull = `<CONTEXT-PROVIDER value="ssr">${duplicatedElements[idx]}</CONTEXT-PROVIDER>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestABCD] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestABCD] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestABCD} />