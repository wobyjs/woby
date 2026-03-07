import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestIdObservable = (): JSX.Element => {
    const o = $('foo')
    registerTestObservable('TestIdObservable', o)
    const toggle = () => o(prev => (prev === 'foo') ? 'bar' : 'foo')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
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

        const ssrComponent = testObservables['TestIdObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>ID - Observable</h3><p id="${value}">content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestIdObservable] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestIdObservable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIdObservable} />