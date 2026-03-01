import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomBigInt, assert } from './util'

const TestBigIntObservable = (): JSX.Element => {
    const o = $(randomBigInt())
    // Store the observable globally so the test can access it
    registerTestObservable('TestBigIntObservable', o)
    const ret: JSX.Element = () => (
        <>
            <h3>BigInt - Observable</h3>
            <p>{o}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestBigIntObservable_ssr', ret)

    return ret
}

TestBigIntObservable.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true, // Use compareActualValues to bypass conversion logic
    expect: () => {
        const value = $$(testObservables['TestBigIntObservable'])
        // Return value without 'n' suffix to match actual rendering
        const expected = `<p>${value}</p>`

        const ssrComponent = testObservables['TestBigIntObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<H3>BigInt - Observable</H3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestBigIntObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestBigIntObservable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestBigIntObservable} />