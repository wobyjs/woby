import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestUndefinedObservable = (): JSX.Element => {
    const o = $<string>(undefined)
    // Store the observable globally so the test can access it
    registerTestObservable('TestUndefinedObservable', o)
    const toggle = () => o(prev => (prev === undefined) ? '' : undefined)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Undefined - Observable</h3>
            <p>{o}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestUndefinedObservable_ssr', ret)

    return ret
}

TestUndefinedObservable.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestUndefinedObservable'])
        const expectedForDOM = value !== undefined ? `<p>${value}</p>` : '<p><!----></p>'
        const expectedForSSR = value !== undefined ? `<p>${value}</p>` : '<p></p>'

        const ssrComponent = testObservables['TestUndefinedObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFullForSSR = value !== undefined ? `<h3>Undefined - Observable</h3><p>${value}</p>` : '<h3>Undefined - Observable</h3><p></p>'
        if (ssrResult !== expectedFullForSSR) {
            assert(false, `[TestUndefinedObservable] SSR mismatch: got \n${ssrResult}, expected \n${expectedFullForSSR}`)
        } else {
            console.log(`✅ [TestUndefinedObservable] SSR test passed: ${ssrResult}`)
        }

        return expectedForDOM
    }
}


export default () => <TestSnapshots Component={TestUndefinedObservable} />