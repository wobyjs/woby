import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestNumberObservable = (): JSX.Element => {
    const o = $(random())
    registerTestObservable('TestNumberObservable', o)
    const randomize = () => o(random())
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Number - Observable</h3>
            <p>{o}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestNumberObservable_ssr', ret)

    return ret
}

TestNumberObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestNumberObservable'])
        const expected = `<p>${value}</p>`

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestNumberObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Number - Observable</h3>' + expected
        if (ssrResult !== expectedFull) {
            assert(false, `[TestNumberObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestNumberObservable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestNumberObservable} />