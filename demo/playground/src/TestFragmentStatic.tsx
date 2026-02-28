import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestFragmentStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>Fragment - Static</h3>
            <p>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestFragmentStatic_ssr', ret)

    return ret
}

TestFragmentStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>content</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestFragmentStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Fragment - Static</h3><p>content</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestFragmentStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestFragmentStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestFragmentStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestFragmentStatic} />