import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

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
    registerTestObservable('TestIfFunctionUntracked_ssr', ret)

    return ret
}

TestIfFunctionUntracked.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<button>Close</button>'
        const expected = '<button>Close</button>'

        const ssrComponent = testObservables['TestIfFunctionUntracked_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestIfFunctionUntracked] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestIfFunctionUntracked] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfFunctionUntracked} />