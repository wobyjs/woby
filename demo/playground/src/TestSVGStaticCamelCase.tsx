import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSVGStaticCamelCase'
const TestSVGStaticCamelCase = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>SVG - Static CamelCase</h3>
            <svg viewBox="0 0 50 50" width="50px" stroke="#abcdef" strokeWidth="3" edgeMode="foo" fill="white">
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
    TestSVGStaticCamelCase()
    const ssrComponent = testObservables[`TestSVGStaticCamelCase_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestSVGStaticCamelCase\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestSVGStaticCamelCase.test = {
    static: true,
    expect: () => {
        const expected = '<svg viewBox="0 0 50 50" width="50px" stroke="#abcdef" stroke-width="3" edgeMode="foo" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>SVG - Static CamelCase</h3><svg viewBox="0 0 50 50" width="50px" stroke="#abcdef" stroke-width="3" edgeMode="foo" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSVGStaticCamelCase} />