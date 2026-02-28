import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestIdStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>ID - Static</h3>
            <p id="foo">content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIdStatic_ssr', ret)

    return ret
}

TestIdStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p id="foo">content</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestIdStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>ID - Static</h3><p id="foo">content</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestIdStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestIdStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestIdStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestIdStatic} />