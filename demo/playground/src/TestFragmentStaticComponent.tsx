import { $, $$, Fragment, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestFragmentStaticComponent = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <Fragment>
            <h3>Fragment - Static Component</h3>
            <p>content</p>
        </Fragment>
    )

    // Store the component for SSR testing
    registerTestObservable('TestFragmentStaticComponent_ssr', ret)

    return ret
}

TestFragmentStaticComponent.test = {
    static: true,
    expect: () => {
        const expected = '<p>content</p>'

        const ssrComponent = testObservables['TestFragmentStaticComponent_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Fragment - Static Component</h3><p>content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestFragmentStaticComponent] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestFragmentStaticComponent] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestFragmentStaticComponent} />