import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSVGClassObject = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>SVG - Class Object</h3>
            <svg class={{ red: true }} viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSVGClassObject_ssr', ret)

    return ret
}

TestSVGClassObject.test = {
    static: true,
    expect: () => {
        const expected = '<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSVGClassObject_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>SVG - Class Object</h3><svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSVGClassObject] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSVGClassObject] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSVGClassObject] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSVGClassObject} />