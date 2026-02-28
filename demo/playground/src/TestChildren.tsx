import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestChildren = (): JSX.Element => {
    const A = ({ children }): JSX.Element => {
        return <div class="A">{children}</div>
    }
    const B = ({ children }): JSX.Element => {
        return <div class="B">{children}</div>
    }
    const C = ({ children }): JSX.Element => {
        return <div class="C">{children}</div>
    }
    const ret: JSX.Element = (
        <>
            <h3>Children</h3>
            <A>
                <B>
                    <C>
                        <p>content</p>
                    </C>
                </B>
            </A>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestChildren_ssr', ret)

    return ret
}

TestChildren.test = {
    static: true,
    expect: () => {
        const expected = '<div class="A"><div class="B"><div class="C"><p>content</p></div></div></div>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestChildren_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Children</h3><div class="A"><div class="B"><div class="C"><p>content</p></div></div></div>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestChildren] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestChildren] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestChildren] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestChildren} />