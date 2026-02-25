import { $, $$, If, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestIfFunctionUntrackedUnnarrowed = (): JSX.Element => {
    const o = $(true)
    const content = $(0)
    const increment = () => content(prev => (prev + 1) % 3)
    useInterval(increment, TEST_INTERVAL)
    const ret = (
        <>
            <h3>If - Function Untracked Unnarrowed</h3>
            <p>(<If when={o}>{() => content()}</If>)</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIfFunctionUntrackedUnnarrowed_ssr', ret)

    return ret
}

TestIfFunctionUntrackedUnnarrowed.test = {
    static: true,
    expect: () => {
        const expected = '<p>(0)</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestIfFunctionUntrackedUnnarrowed_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>If - Function Untracked Unnarrowed</h3><p>(0)</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestIfFunctionUntrackedUnnarrowed] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestIfFunctionUntrackedUnnarrowed] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestIfFunctionUntrackedUnnarrowed] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfFunctionUntrackedUnnarrowed} />