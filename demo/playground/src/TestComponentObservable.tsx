import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestComponentObservable = (): JSX.Element => {
    const getRandom = (): number => random()
    const o = $(getRandom())
    // Store the observable globally so the test can access it
    registerTestObservable('TestComponentObservable', o)
    const randomize = () => o(getRandom())
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Component - Observable</h3>
            <p>{o}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestComponentObservable_ssr', ret)

    return ret
}

TestComponentObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestComponentObservable'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Component - Observable</h3><p>${value}</p>`  // For SSR comparison
        const expected = `<p>${value}</p>`   // For main test comparison

            const ssrComponent = testObservables['TestComponentObservable_ssr']
            const ssrResult = renderToString(ssrComponent)
            if (ssrResult !== expectedFull) {
                assert(false, `[TestComponentObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
            } else {
                console.log(`✅ [TestComponentObservable] SSR test passed: ${ssrResult}`)
            }

        return expected
    }
}


export default () => <TestSnapshots Component={TestComponentObservable} />