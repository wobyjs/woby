import { $, $$, Ternary, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestTernaryStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Ternary - Static</h3>
            <Ternary when={true}>
                <p>true (1)</p>
                <p>false (1)</p>
            </Ternary>
            <Ternary when={false}>
                <p>true (2)</p>
                <p>false (2)</p>
            </Ternary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestTernaryStatic_ssr', ret)

    return ret
}

TestTernaryStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>true (1)</p><p>false (2)</p>'

        const ssrComponent = testObservables['TestTernaryStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Ternary - Static</h3><p>true (1)</p><p>false (2)</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestTernaryStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestTernaryStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTernaryStatic} />