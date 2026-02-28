import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSVGStyleString = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>SVG - Style String</h3>
            <svg style="stroke: red; fill: pink;" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSVGStyleString_ssr', ret)

    return ret
}

TestSVGStyleString.test = {
    static: true,
    expect: () => {
        const expected = '<svg style="stroke: red; fill: pink;" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSVGStyleString_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>SVG - Style String</h3><svg style="stroke: red; fill: pink;" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSVGStyleString] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSVGStyleString] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSVGStyleString] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSVGStyleString} />