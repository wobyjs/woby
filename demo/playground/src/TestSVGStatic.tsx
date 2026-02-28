import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSVGStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>SVG - Static</h3>
            <svg viewBox="0 0 50 50" width="50px" xmlns="http://www.w3.org/2000/svg" stroke="#ef8eb9" stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSVGStatic_ssr', ret)

    return ret
}

TestSVGStatic.test = {
    static: true,
    expect: () => {
        const expected = '<svg viewBox="0 0 50 50" width="50px" xmlns="http://www.w3.org/2000/svg" stroke="#ef8eb9" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSVGStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>SVG - Static</h3><svg viewBox="0 0 50 50" width="50px" xmlns="http://www.w3.org/2000/svg" stroke="#ef8eb9" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSvgStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSvgStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSvgStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSVGStatic} />