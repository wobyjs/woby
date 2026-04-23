import { $, $$, For, ObservableReadonly, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestForUnkeyedFallbackStatic'
const TestForUnkeyedFallbackStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>For - Unkeyed - Fallback Static</h3>
            <For values={[]} fallback={<div>Fallback!</div>} unkeyed>
                {(value: ObservableReadonly<unknown> | ObservableReadonly<any>) => {
                    return <p>Value: {String(value)}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestForUnkeyedFallbackStatic()
    const ssrComponent = testObservables[`TestForUnkeyedFallbackStatic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestForUnkeyedFallbackStatic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestForUnkeyedFallbackStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>For - Unkeyed - Fallback Static</h3><div>Fallback!</div>'
        const expected = '<div>Fallback!</div>'

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


export default () => <TestSnapshots Component={TestForUnkeyedFallbackStatic} />