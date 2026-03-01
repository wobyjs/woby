import { $, $$, Dynamic, tick, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestDynamicFunctionComponent = (): JSX.Element => {
    const level = $(1)
    registerTestObservable('TestDynamicFunctionComponent', level)
    const component = () => `h${level()}`
    const increment = () => {
        level((level() + 1) % 7 || 1)
    }
    useInterval(increment, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Dynamic - Function Component</h3>
            <Dynamic component={component}>
                Level: {level}
            </Dynamic>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestDynamicFunctionComponent_ssr', ret)

    return ret
}

TestDynamicFunctionComponent.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const level = $$(testObservables['TestDynamicFunctionComponent'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Dynamic - Function Component</h3><h${level}>Level: ${level}</h${level}>`  // For SSR comparison
        const expected = `<h${level}>Level: ${level}</h${level}>`   // For main test comparison

        const ssrComponent = testObservables['TestDynamicFunctionComponent_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestDynamicFunctionComponent] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestDynamicFunctionComponent] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestDynamicFunctionComponent} />