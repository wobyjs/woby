import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleRemoval = (): JSX.Element => {
    const o = $<string | null>('green')
    registerTestObservable('TestStyleRemoval', o)
    const toggle = () => o(prev => prev ? null : 'green')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Style - Removal</h3>
            <p style={{ color: o }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStyleRemoval_ssr', ret)

    return ret
}

TestStyleRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestStyleRemoval'])
        const expected = value ? `<p style="color: ${value};">content</p>` : '<p style="">content</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestStyleRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = value ?
            `<h3>Style - Removal</h3><p style="color: ${value};">content</p>` :
            '<h3>Style - Removal</h3><p>content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStyleRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestStyleRemoval] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleRemoval} />