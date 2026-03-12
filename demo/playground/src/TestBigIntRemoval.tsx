import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomBigInt, assert } from './util'

const TestBigIntRemoval = (): JSX.Element => {
    const o = $<bigint | null>(null)
    registerTestObservable('TestBigIntRemoval', o)
    const ret: JSX.Element = () => (
        <>
            <h3>BigInt - Removal</h3>
            <p>({o})</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestBigIntRemoval_ssr', ret)

    return ret
}

TestBigIntRemoval.test = {
    static: true, // Make it static for predictable testing
    // Let TestSnapshots handle the conversion of BigInt values to placeholders
    expect: () => {
        const expected = '<p>(<!---->)</p>'

        const ssrComponent = testObservables['TestBigIntRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>BigInt - Removal</h3><p>()</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestBigIntRemoval] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestBigIntRemoval] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestBigIntRemoval} />