import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSVGClassString = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>SVG - Class String</h3>
            <svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSVGClassString_ssr', ret)

    return ret
}

TestSVGClassString.test = {
    static: true,
    expect: () => {
        const expected = '<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'

        const ssrComponent = testObservables['TestSVGClassString_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>SVG - Class String</h3><svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSVGClassString] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSVGClassString] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSVGClassString} />