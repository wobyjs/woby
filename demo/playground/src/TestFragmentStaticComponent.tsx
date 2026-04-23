import { $, $$, Fragment, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestFragmentStaticComponent'
const TestFragmentStaticComponent = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <Fragment>
            <h3>Fragment - Static Component</h3>
            <p>content</p>
        </Fragment>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestFragmentStaticComponent()
    const ssrComponent = testObservables[`TestFragmentStaticComponent_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestFragmentStaticComponent\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestFragmentStaticComponent.test = {
    static: true,
    expect: () => {
        const expected = '<p>content</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Fragment - Static Component</h3><p>content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestFragmentStaticComponent} />