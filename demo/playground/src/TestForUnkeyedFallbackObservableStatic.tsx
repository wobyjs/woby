import { $, $$, For, ObservableReadonly, renderToString, type JSX } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, assert } from './util'

const name = 'TestForUnkeyedFallbackObservableStatic'
const TestForUnkeyedFallbackObservableStatic = (): JSX.Element => {
    const Fallback = () => {
        return (
            <>
                <p>Fallback: 0.123456</p>
            </>
        )
    }
    const ret: JSX.Element = () => (
        <>
            <h3>For - Unkeyed - Fallback Observable Static</h3>
            <For values={[]} fallback={<Fallback />} unkeyed>
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
    TestForUnkeyedFallbackObservableStatic()
    const ssrComponent = testObservables[`TestForUnkeyedFallbackObservableStatic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestForUnkeyedFallbackObservableStatic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestForUnkeyedFallbackObservableStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>For - Unkeyed - Fallback Observable Static</h3><p>Fallback: 0.123456</p>'
        const expected = '<p>Fallback: 0.123456</p>'

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


export default () => <TestSnapshots Component={TestForUnkeyedFallbackObservableStatic} />