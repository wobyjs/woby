import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleFunction = (): JSX.Element => {
    const o = $('green')
    // Store the observable globally so the test can access it
    registerTestObservable('TestStyleFunction', o)
    const toggle = () => o(prev => (prev === 'green') ? 'orange' : 'green')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Style - Function</h3>
            <p style={{ color: () => o() }}>content</p>
        </>
    )

    // Store the component for SSR testing - only in environments where function is available
    if (typeof registerTestObservable !== 'undefined') {
        registerTestObservable('TestStyleFunction_ssr', ret)
    }

    return ret
}

TestStyleFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const color = testObservables['TestStyleFunction']?.() ?? 'green'
        const expected = `<p style="color: ${color};">content</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStyleFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Style - Function</h3><p style="color: ${color};">content</p>`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestStyleFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestStyleFunction] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestStyleFunction] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleFunction} />