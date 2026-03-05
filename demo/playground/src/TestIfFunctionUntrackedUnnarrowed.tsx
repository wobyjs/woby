import { $, $$, If, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestIfFunctionUntrackedUnnarrowed = (): JSX.Element => {
    const o = $(true)
    const content = $(0)
    const increment = () => content(prev => (prev + 1) % 3)
    useInterval(increment, TEST_INTERVAL)
    const ret = () => (
        <>
            <h3>If - Function Untracked Unnarrowed</h3>
            <p>(<If when={o}>{() => content()}</If>)</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIfFunctionUntrackedUnnarrowed_ssr', ret)

    return null //ret
}

TestIfFunctionUntrackedUnnarrowed.test = {
    static: true,
    expect: () => {
        const expected = '<p>(0)</p>'

        const ssrComponent = testObservables['TestIfFunctionUntrackedUnnarrowed_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>If - Function Untracked Unnarrowed</h3><p>(0)</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestIfFunctionUntrackedUnnarrowed] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestIfFunctionUntrackedUnnarrowed] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfFunctionUntrackedUnnarrowed} />