import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestNumberFunction = (): JSX.Element => {
    const o = $(random())
    registerTestObservable('TestNumberFunction', o)
    const randomize = () => o(random())
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Number - Function</h3>
            <p>{() => o()}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestNumberFunction_ssr', ret)

    return ret
}

TestNumberFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestNumberFunction'])
        const expected = `<p>${value}</p>`

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestNumberFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Number - Function</h3>' + expected
        if (ssrResult !== expectedFull) {
            assert(false, `[TestNumberFunction] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestNumberFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestNumberFunction} />