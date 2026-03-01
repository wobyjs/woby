import { $, $$, For, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestForFallbackStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>For - Fallback Static</h3>
            <For values={[]} fallback={<div>Fallback!</div>}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForFallbackStatic_ssr', ret)

    return ret
}

TestForFallbackStatic.test = {
    static: true,
    expect: () => {
        const expected = '<div>Fallback!</div>'

        const ssrComponent = testObservables['TestForFallbackStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>For - Fallback Static</h3><div>Fallback!</div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestForFallbackStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestForFallbackStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForFallbackStatic} />