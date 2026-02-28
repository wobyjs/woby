import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestIdObservable = (): JSX.Element => {
    const o = $('foo')
    registerTestObservable('TestIdObservable', o)
    const toggle = () => o(prev => (prev === 'foo') ? 'bar' : 'foo')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>ID - Observable</h3>
            <p id={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIdObservable_ssr', ret)

    return ret
}

TestIdObservable.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestIdObservable'])
        const expected = `<p id="${value}">content</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestIdObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>ID - Observable</h3><p id="${value}">content</p>`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestIdObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestIdObservable] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestIdObservable] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestIdObservable} />