import { $, $$, For, ObservableReadonly, renderToString, type JSX } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, assert } from './util'

const name = 'TestForUnkeyedRandomOnlyChild'
const TestForUnkeyedRandomOnlyChild = (): JSX.Element => {
    // Use fixed values instead of random for static test
    const values = [0.123456, 0.789012, 0.345678]  // Fixed values for static test
    const ret: JSX.Element = () => (
        <>
            <h3>For - Unkeyed - Random Only Child</h3>
            <For values={values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>{value}</p>
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
    TestForUnkeyedRandomOnlyChild()
    const ssrComponent = testObservables[`TestForUnkeyedRandomOnlyChild_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestForUnkeyedRandomOnlyChild\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestForUnkeyedRandomOnlyChild.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>For - Unkeyed - Random Only Child</h3><p>0.123456</p><p>0.789012</p><p>0.345678</p>'
        const expected = '<p>0.123456</p><p>0.789012</p><p>0.345678</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        // For static test, return the fixed values
        return expected
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedRandomOnlyChild} />