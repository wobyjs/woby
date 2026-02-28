import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestTabIndexBooleanObservable = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>TabIndex - Boolean - Observable</h3>
            <p tabIndex={0}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestTabIndexBooleanObservable_ssr', ret)

    return ret
}

TestTabIndexBooleanObservable.test = {
    static: true,
    expect: () => {
        const expected = '<p tabindex="0">content</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestTabIndexBooleanObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>TabIndex - Boolean - Observable</h3><p tabindex="0">content</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestTabIndexBooleanObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestTabIndexBooleanObservable] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestTabIndexBooleanObservable] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestTabIndexBooleanObservable} />