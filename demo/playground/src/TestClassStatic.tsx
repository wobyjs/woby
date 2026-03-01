import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Class - Static</h3>
            <p class={{ red: true, blue: false }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassStatic_ssr', ret)

    return ret
}

TestClassStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p class="red">content</p>'

        const ssrComponent = testObservables['TestClassStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Class - Static</h3><p class="red">content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestClassStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassStatic} />