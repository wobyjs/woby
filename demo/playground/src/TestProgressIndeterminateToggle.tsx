import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestProgressIndeterminateToggle = (): JSX.Element => {
    const o = $<number | null | undefined>(.25)
    registerTestObservable('TestProgressIndeterminateToggle', o)
    const values = [.25, null, .5, undefined]
    const cycle = () => o(prev => values[(values.indexOf(prev) + 1) % values.length])
    useInterval(cycle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Progress - Indeterminate Toggle</h3>
            <progress value={o} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestProgressIndeterminateToggle_ssr', ret)

    return ret
}

TestProgressIndeterminateToggle.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val = $$(testObservables['TestProgressIndeterminateToggle'])
        const expected = (val !== null && val !== undefined) ? `<progress value="${val}"></progress>` : '<progress></progress>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestProgressIndeterminateToggle_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Progress - Indeterminate Toggle</h3>' + expected
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestProgressIndeterminateToggle] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestProgressIndeterminateToggle] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestProgressIndeterminateToggle] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestProgressIndeterminateToggle} />