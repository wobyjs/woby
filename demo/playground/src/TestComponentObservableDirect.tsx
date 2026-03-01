import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestComponentObservableDirect = (): JSX.Element => {
    const getRandom = (): number => random()
    const o = $(getRandom())
    registerTestObservable('TestComponentObservableDirect', o)
    const randomize = () => o(getRandom())
    useInterval(randomize, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <>
            <h3>Component - Observable Direct</h3>
            <p>{o}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestComponentObservableDirect_ssr', ret)

    return ret
}

TestComponentObservableDirect.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestComponentObservableDirect'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Component - Observable Direct</h3><p>${value}</p>`  // For SSR comparison
        const expected = `<p>${value}</p>`   // For main test comparison

        const ssrComponent = testObservables['TestComponentObservableDirect_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestComponentObservableDirect] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestComponentObservableDirect] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}



export default () => <TestSnapshots Component={TestComponentObservableDirect} />