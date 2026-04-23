import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestIfFunctionUntrackedUnnarrowed'
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestIfFunctionUntrackedUnnarrowed()
    const ssrComponent = testObservables[`TestIfFunctionUntrackedUnnarrowed_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestIfFunctionUntrackedUnnarrowed\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestIfFunctionUntrackedUnnarrowed.test = {
    static: true,
    expect: () => {
        const expected = '<p>(0)</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>If - Function Untracked Unnarrowed</h3><p>(0)</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfFunctionUntrackedUnnarrowed} />