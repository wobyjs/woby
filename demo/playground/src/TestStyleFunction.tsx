import { $, $$, render, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleFunction = (): JSX.Element => {
    const o = $('green')
    // Store the observable globally so the test can access it
    registerTestObservable('TestStyleFunction', o)
    const toggle = () => o(prev => (prev === 'green') ? 'orange' : 'green')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
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
        const color = $$(testObservables['TestStyleFunction']) ?? 'green'
        const expected = `<p style="color: ${color};">content</p>`

        // Test the SSR value
        const ssrComponent = testObservables['TestStyleFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Style - Function</h3><p style="color: ${color};">content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStyleFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestStyleFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleFunction} />

console.log(renderToString(<TestStyleFunction />))