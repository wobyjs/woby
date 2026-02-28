import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestHTMLInnerHTMLFunction = (): JSX.Element => {
    const o = $('<b>danger1</b>')
    const toggle = () => o(prev => (prev === '<b>danger1</b>') ? '<b>danger2</b>' : '<b>danger1</b>')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>HTML - innerHTML - Function</h3>
            <p innerHTML={() => o()} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestHTMLInnerHTMLFunction_ssr', ret)

    return ret
}

TestHTMLInnerHTMLFunction.test = {
    static: true,
    expect: () => {
        const expected = '<p></p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestHTMLInnerHTMLFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>HTML - innerHTML - Function</h3><p></p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestHTMLInnerHTMLFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestHTMLInnerHTMLFunction] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestHTMLInnerHTMLFunction] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLInnerHTMLFunction} />