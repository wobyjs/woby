import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestStringFunction = (): JSX.Element => {
    const o = $(String(random()))
    // Store the observable globally so the test can access it
    registerTestObservable('TestStringFunction', o)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>String - Function</h3>
            <p>{() => o()}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStringFunction_ssr', ret)

    return ret
}

TestStringFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestStringFunction'])
        const expected = `<p>${value}</p>`

        // Test the SSR value
        const ssrComponent = testObservables['TestStringFunction_ssr']
        if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
            const ssrResult = renderToString(ssrComponent)
            const expectedFull = `<h3>String - Function</h3><p>${value}</p>`
            if (ssrResult !== expectedFull) {
                assert(false, `[TestStringFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
            } else {
                console.log(`✅ [TestStringFunction] SSR test passed: ${ssrResult}`)
            }
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStringFunction} />