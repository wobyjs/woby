import { $, $$, Dynamic, tick, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestDynamicFunctionComponent'
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestDynamicFunctionComponent()
    const ssrComponent = testObservables[`TestDynamicFunctionComponent_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestDynamicFunctionComponent\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestDynamicFunctionComponent.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const level = $$(testObservables[name])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Dynamic - Function Component</h3>h${level}`  // For SSR comparison
        const expected = `h${level}`   // For main test comparison

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


export default () => <TestSnapshots Component={TestDynamicFunctionComponent} />