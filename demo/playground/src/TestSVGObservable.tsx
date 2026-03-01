import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSVGObservable = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>SVG - Observable</h3>
            <svg viewBox="0 0 50 50" width="50px" stroke="#abcdef" stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSVGObservable_ssr', ret)

    return ret
}

TestSVGObservable.test = {
    static: true,
    expect: () => {
        const expected = '<svg viewBox="0 0 50 50" width="50px" stroke="#abcdef" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'

        const ssrComponent = testObservables['TestSVGObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>SVG - Observable</h3><svg viewBox="0 0 50 50" width="50px" stroke="#abcdef" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSVGObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSVGObservable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSVGObservable} />