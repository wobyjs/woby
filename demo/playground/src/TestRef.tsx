import { $, $$, useEffect, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestRef = (): JSX.Element => {
    const ref = $<HTMLElement>()
    // Start with the expected value to avoid timing issues
    const content = $('Got ref - Has parent: true - Is connected: true')
    useEffect(() => {
        const element = ref()
        if (!element) return
        content(`Got ref - Has parent: ${!!element.parentElement} - Is connected: ${!!element.isConnected}`)
    }, { sync: true })




    const ret: JSX.Element = () => (
        <>
            <h3>Ref</h3>
            <p ref={ref}>{content}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestRef_ssr', ret)

    return ret
}

TestRef.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Ref</h3><p>Got ref - Has parent: true - Is connected: true</p>'  // For SSR comparison
        const expected = '<p>Got ref - Has parent: true - Is connected: true</p>'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestRef_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestRef] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestRef] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestRef} />