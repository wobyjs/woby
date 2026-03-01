import { $, $$, Ternary, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestTernaryStaticInline = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Ternary - Static Inline</h3>
            <Ternary when={true}><p>true (1)</p><p>false (1)</p></Ternary>
            <Ternary when={false}><p>true (2)</p><p>false (2)</p></Ternary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestTernaryStaticInline_ssr', ret)

    return ret
}

TestTernaryStaticInline.test = {
    static: true,
    expect: () => {
        const expected = '<p>true (1)</p><p>false (2)</p>'

        const ssrComponent = testObservables['TestTernaryStaticInline_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Ternary - Static Inline</h3><p>true (1)</p><p>false (2)</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestTernaryStaticInline] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestTernaryStaticInline] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTernaryStaticInline} />