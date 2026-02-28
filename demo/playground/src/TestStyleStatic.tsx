import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>Style - Static</h3>
            <p style={{ color: 'green' }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStyleStatic_ssr', ret)

    return ret
}

TestStyleStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p style="color: green;">content</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStyleStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Style - Static</h3><p style="color: green;">content</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestStyleStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestStyleStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestStyleStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleStatic} />