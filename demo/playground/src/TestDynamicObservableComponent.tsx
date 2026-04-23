import { $, $$, Dynamic, useMemo, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestDynamicObservableComponent'
const TestDynamicObservableComponent = (): JSX.Element => {
    const level = $(1)
    registerTestObservable('TestDynamicObservableComponent', level)
    const component = useMemo(() => `h${level()}`)
    const increment = () => {
        level((level() + 1) % 7 || 1)
    }
    useInterval(increment, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Dynamic - Observable Component</h3>
            <Dynamic component={component}>
                Level: {level}
            </Dynamic>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestDynamicObservableComponent()
    const ssrComponent = testObservables[`TestDynamicObservableComponent_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestDynamicObservableComponent\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestDynamicObservableComponent.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const level = $$(testObservables[name])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Dynamic - Observable Component</h3><h${level}>Level: ${$$(level)}</h${level}>`  // For SSR comparison
        const expected = `<h${level}>Level: ${$$(level)}</h${level}>`   // For main test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestDynamicObservableComponent} />