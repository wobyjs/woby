import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomBigInt, assert } from './util'

const TestBigIntFunction = (): JSX.Element => {
    const o = $(randomBigInt())
    // Store the observable globally so the test can access it
    registerTestObservable('TestBigIntFunction', o)
    const ret: JSX.Element = () => (
        <>
            <h3>BigInt - Function</h3>
            <p>{() => o()}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestBigIntFunction_ssr', ret)

    return ret
}

TestBigIntFunction.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true, // Use compareActualValues to bypass conversion logic
    expect: () => {
        const value = $$(testObservables['TestBigIntFunction'])
        // Return value without 'n' suffix to match actual rendering
        const expected = `<p>${value}</p>`

        const ssrComponent = testObservables['TestBigIntFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<H3>BigInt - Function</H3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestBigIntFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestBigIntFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestBigIntFunction} />