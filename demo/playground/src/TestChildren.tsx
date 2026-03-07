import { $, $$, renderToString, type JSX } from 'woby'
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
    const ret: JSX.Element = () => (
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
        const expected = '<div><div><div><p>content</p></div></div></div>'

        const ssrComponent = testObservables['TestChildren_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Children</h3><div class="A"><div class="B"><div class="C"><p>content</p></div></div></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestChildren] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestChildren] SSR test passed: ${ssrResult}`)
        }

        return '<div class="A"><div class="B"><div class="C"><p>content</p></div></div></div>'
    }
}


export default () => <TestSnapshots Component={TestChildren} />