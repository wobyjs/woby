import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestFragmentStaticDeep = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>Fragment - Static Deep</h3>
            <>
                <p>first</p>
            </>
            <>
                <p>second</p>
            </>
            <>
                <>
                    <>
                        <>
                            <p>deep</p>
                        </>
                    </>
                </>
            </>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestFragmentStaticDeep_ssr', ret)

    return ret
}

TestFragmentStaticDeep.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Fragment - Static Deep</h3><p>first</p><p>second</p><p>deep</p>'
        const expected = '<p>first</p><p>second</p><p>deep</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestFragmentStaticDeep_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestFragmentStaticDeep] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestFragmentStaticDeep] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestFragmentStaticDeep] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestFragmentStaticDeep} />