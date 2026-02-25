import { $, $$, renderToString } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, assert } from './util'

const TestStringObservableStatic = (): JSX.Element => {
    const initialValue = "0.123456"
    const ret: JSX.Element = (
        <>
            <h3>String - Observable Static</h3>
            <p>{initialValue}</p>
        </>
    )

    // Store the component for SSR testing - only in environments where function is available
    if (typeof registerTestObservable !== 'undefined') {
        registerTestObservable('TestStringObservableStatic_ssr', ret)
    }

    return ret
}

TestStringObservableStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>0.123456</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStringObservableStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>String - Observable Static</h3><p>0.123456</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestStringObservableStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestStringObservableStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestStringObservableStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestStringObservableStatic} />