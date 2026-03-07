import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

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
    registerTestObservable('TestIfChildrenObservable_ssr', ret)

    return ret
}

TestIfChildrenObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestIfChildrenObservable'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>If - Children Observable</h3>${value}`
        const expected = value

        const ssrComponent = testObservables['TestIfChildrenObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestIfChildrenObservable] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestIfChildrenObservable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfChildrenObservable} />