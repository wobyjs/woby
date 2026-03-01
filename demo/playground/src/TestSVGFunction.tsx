import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomColor, assert } from './util'

const TestSVGFunction = (): JSX.Element => {
    const color = $(randomColor())
    registerTestObservable('TestSVGFunction', color)
    const update = () => color(randomColor())
    useInterval(update, TEST_INTERVAL / 2)
    const ret: JSX.Element = () => (
        <>
            <h3>SVG - Function</h3>
            <svg viewBox="0 0 50 50" width="50px" stroke={() => color()} stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSVGFunction_ssr', ret)

    return ret
}

TestSVGFunction.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestSVGFunction'])
        const expected = `<svg viewBox="0 0 50 50" width="50px" stroke="${value}" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>`

        const ssrComponent = testObservables['TestSVGFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>SVG - Function</h3><svg viewBox="0 0 50 50" width="50px" stroke="${value}" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSVGFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSVGFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSVGFunction} />