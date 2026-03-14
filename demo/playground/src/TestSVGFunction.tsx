import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomColor, assert } from './util'

const name = 'TestSVGFunction'
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestSVGFunction.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables[name])
        const expected = `<svg viewBox="0 0 50 50" width="50px" stroke="${value}" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>SVG - Function</h3><svg viewBox="0 0 50 50" width="50px" stroke="${value}" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSVGFunction} />