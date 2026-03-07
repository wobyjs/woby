import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestFragmentStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
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

        const ssrComponent = testObservables['TestFragmentStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Fragment - Static</h3><p>content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestFragmentStatic] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestFragmentStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestFragmentStatic} />