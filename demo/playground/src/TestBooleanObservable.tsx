import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestBooleanObservable = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Boolean - Observable</h3>
            <p>{o}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestBooleanObservable_ssr', ret)

    return ret
}

TestBooleanObservable.test = {
    static: true,
    expect: () => {
        const expected = '<p></p>'

        const ssrComponent = testObservables['TestBooleanObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Boolean - Observable</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestBooleanObservable] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestBooleanObservable] SSR test passed: ${ssrResult}`)
        }

        return '<p><!----></p>'
    }
}


export default () => <TestSnapshots Component={TestBooleanObservable} />