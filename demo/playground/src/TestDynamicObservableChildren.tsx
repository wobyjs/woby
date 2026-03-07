import { $, $$, Dynamic, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestDynamicObservableChildren = (): JSX.Element => {
    const o = $(random())
    registerTestObservable('TestDynamicObservableChildren', o)
    const update = () => o(random())
    useInterval(update, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Dynamic - Observable Children</h3>
            <Dynamic component="h5">
                {o}
            </Dynamic>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestDynamicObservableChildren_ssr', ret)

    return ret
}

TestDynamicObservableChildren.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestDynamicObservableChildren'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Dynamic - Observable Children</h3><h5>${value}</h5>`  // For SSR comparison
        const expected = `<h5>${value}</h5>`   // For main test comparison

        const ssrComponent = testObservables['TestDynamicObservableChildren_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestDynamicObservableChildren] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestDynamicObservableChildren] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestDynamicObservableChildren} />