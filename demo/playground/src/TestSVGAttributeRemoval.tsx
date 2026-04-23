import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSVGAttributeRemoval'
const TestSVGAttributeRemoval = (): JSX.Element => {
    const o = $<string | null>('red')
    // Store the observable globally so the test can access it
    registerTestObservable('TestSVGAttributeRemoval', o)
    const toggle = () => o(prev => (prev === 'red') ? null : 'red')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>SVG - Attribute Removal</h3>
            <svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" version={o} />
            </svg>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestSVGAttributeRemoval()
    const ssrComponent = testObservables[`TestSVGAttributeRemoval_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestSVGAttributeRemoval\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestSVGAttributeRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        const expected = value ?
            `<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20" version="${value}"></circle></svg>` :
            '<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = value ?
            `<h3>SVG - Attribute Removal</h3><svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20" version="${value}"></circle></svg>` :
            '<h3>SVG - Attribute Removal</h3><svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSVGAttributeRemoval} />