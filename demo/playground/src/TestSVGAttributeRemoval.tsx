import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

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
    registerTestObservable('TestSVGAttributeRemoval_ssr', ret)

    return ret
}

TestSVGAttributeRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestSVGAttributeRemoval'])
        const expected = value ?
            `<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20" version="${value}"></circle></svg>` :
            '<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'

        const ssrComponent = testObservables['TestSVGAttributeRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = value ?
            `<h3>SVG - Attribute Removal</h3><svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20" version="${value}"></circle></svg>` :
            '<h3>SVG - Attribute Removal</h3><svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSVGAttributeRemoval] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestSVGAttributeRemoval] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSVGAttributeRemoval} />