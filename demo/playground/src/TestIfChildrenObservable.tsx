import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestIfChildrenObservable'
const TestIfChildrenObservable = (): JSX.Element => {
    const o = $(String(random()))
    registerTestObservable('TestIfChildrenObservable', o)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>If - Children Observable</h3>
            <If when={true}>{o}</If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestIfChildrenObservable()
    const ssrComponent = testObservables[`TestIfChildrenObservable_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestIfChildrenObservable\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestIfChildrenObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>If - Children Observable</h3>${value}`
        const expected = value

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


export default () => <TestSnapshots Component={TestIfChildrenObservable} />