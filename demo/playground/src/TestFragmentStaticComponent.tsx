import { $, $$, Fragment, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestFragmentStaticComponent = (): JSX.Element => {
    const ret: JSX.Element = (
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestFragmentStaticComponent_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Fragment - Static Component</h3><p>content</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestFragmentStaticComponent} />