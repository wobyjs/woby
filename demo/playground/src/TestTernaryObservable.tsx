import { $, $$, Ternary, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestTernaryObservable = (): JSX.Element => {
    const o = $(true)
    registerTestObservable('TestTernaryObservable', o)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Ternary - Observable</h3>
            <Ternary when={o}>
                <p>true</p>
                <p>false</p>
            </Ternary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestTernaryObservable_ssr', ret)

    return ret
}

TestTernaryObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = testObservables['TestTernaryObservable']?.() ?? true
        const expected = `<p>${value ? 'true' : 'false'}</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestTernaryObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Ternary - Observable</h3><p>${value ? 'true' : 'false'}</p>`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestTernaryObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestTernaryObservable] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestTernaryObservable] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestTernaryObservable} />