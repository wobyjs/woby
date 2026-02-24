import { $, $$, If, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestIfFunctionUntracked = (): JSX.Element => {
    // Static values for static test
    const ret: JSX.Element = (
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestIfFunctionUntracked_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
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


export default () => <TestSnapshots Component={TestIfFunctionUntracked} />