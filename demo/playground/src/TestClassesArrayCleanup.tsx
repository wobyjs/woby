import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesArrayCleanup = (): JSX.Element => {
    const o = $<string[]>(['red'])
    registerTestObservable('TestClassesArrayCleanup', o)
    const toggle = () => o(prev => prev[0] === 'red' ? ['blue'] : ['red'])
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Classes - Array Cleanup</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayCleanup_ssr', ret)

    return ret
}

TestClassesArrayCleanup.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayCleanup'])
        const expected = `<p class="${Array.isArray(value) ? value.filter(v => v).join(' ') : value}">content</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestClassesArrayCleanup_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Classes - Array Cleanup</h3>${expected}`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestClassesArrayCleanup] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestClassesArrayCleanup] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestClassesArrayCleanup] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayCleanup} />