import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestEventMiddleClickStatic = (): JSX.Element => {
    const o = $(0)
    registerTestObservable('TestEventMiddleClickStatic_o', o)
    const increment = () => o(prev => prev + 1)

    const ret: JSX.Element = () => (
        <>
            <h3>Event - Middle Click Static</h3>
            <p><button onClick={increment}>{o}</button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestEventMiddleClickStatic_ssr', ret)

    return ret
}


TestEventMiddleClickStatic.test = {
    static: true,
    expect: () => {
        const value = testObservables['TestEventMiddleClickStatic_o']?.() ?? 0

        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Event - Middle Click Static</h3><p><button>0</button></p>'  // For SSR comparison
        const expected = '<p><button>0</button></p>'   // For main test comparison

        const ssrComponent = testObservables['TestEventMiddleClickStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestEventMiddleClickStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestEventMiddleClickStatic] SSR test passed: ${ssrResult}`)
        }

        // For static test, expect the initial value (0) since no updates should happen
        return expected
    }
}

export default () => <TestSnapshots Component={TestEventMiddleClickStatic} />