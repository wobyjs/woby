import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleObservable = (): JSX.Element => {
    const o = $('green')
    registerTestObservable('TestStyleObservable', o)
    const toggle = () => o(prev => (prev === 'green') ? 'orange' : 'green')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Style - Observable</h3>
            <p style={{ color: o }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStyleObservable_ssr', ret)

    return ret
}

TestStyleObservable.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestStyleObservable'])
        const expected = `<p style="color: ${value};">content</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStyleObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Style - Observable</h3><p style="color: ${value};">content</p>`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestStyleObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestStyleObservable] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestStyleObservable] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleObservable} />