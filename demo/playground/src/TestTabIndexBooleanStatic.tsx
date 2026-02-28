import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestTabIndexBooleanStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>TabIndex - Boolean - Static</h3>
            <p tabIndex={true}>true</p>
            <p tabIndex={false}>false</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestTabIndexBooleanStatic_ssr', ret)

    return ret
}

TestTabIndexBooleanStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p tabindex="0">true</p><p>false</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestTabIndexBooleanStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>TabIndex - Boolean - Static</h3><p tabindex="0">true</p><p>false</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestTabIndexBooleanStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestTabIndexBooleanStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestTabIndexBooleanStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestTabIndexBooleanStatic} />