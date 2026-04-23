import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const name = 'TestIfFunctionUntracked'
const TestIfFunctionUntracked = (): JSX.Element => {
    // Static values for static test
    const ret: JSX.Element = () => (
        <>
            <If when={true}>
                <If when={true} fallback="fallback">
                    {() => (
                        <button onClick={() => { }}>
                            Close
                        </button>
                    )}
                </If>
            </If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestIfFunctionUntracked()
    const ssrComponent = testObservables[`TestIfFunctionUntracked_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestIfFunctionUntracked\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestIfFunctionUntracked.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<button>Close</button>'
        const expected = '<button>Close</button>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfFunctionUntracked} />