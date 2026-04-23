import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestChildren'
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestChildren() // Register the component
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const expectedFull = '<h3>Children</h3><div class="A"><div class="B"><div class="C"><p>content</p></div></div></div>'
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestChildren.test = {
    static: true,
    expect: () => {
        return '<div class="A"><div class="B"><div class="C"><p>content</p></div></div></div>'
    }
}


export default () => <TestSnapshots Component={TestChildren} />