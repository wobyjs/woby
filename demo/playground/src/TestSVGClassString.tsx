import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSVGClassString'
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestSVGClassString()
    const ssrComponent = testObservables[`TestSVGClassString_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestSVGClassString\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestSVGClassString.test = {
    static: true,
    expect: () => {
        const expected = '<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>SVG - Class String</h3><svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSVGClassString} />