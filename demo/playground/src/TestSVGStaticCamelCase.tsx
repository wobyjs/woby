import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSVGStaticCamelCase = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>SVG - Static CamelCase</h3>
            <svg viewBox="0 0 50 50" width="50px" stroke="#abcdef" strokeWidth="3" edgeMode="foo" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSVGStaticCamelCase_ssr', ret)

    return ret
}

TestSVGStaticCamelCase.test = {
    static: true,
    expect: () => {
        const expected = '<svg viewBox="0 0 50 50" width="50px" stroke="#abcdef" stroke-width="3" edgeMode="foo" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSVGStaticCamelCase_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>SVG - Static CamelCase</h3><svg viewBox="0 0 50 50" width="50px" stroke="#abcdef" stroke-width="3" edgeMode="foo" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSVGStaticCamelCase] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSVGStaticCamelCase] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSVGStaticCamelCase] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSVGStaticCamelCase} />