import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestFragmentStaticDeep'
const TestFragmentStaticDeep = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Fragment - Static Deep</h3>
            <>
                <p>first</p>
            </>
            <>
                <p>second</p>
            </>
            <>
                <>
                    <>
                        <>
                            <p>deep</p>
                        </>
                    </>
                </>
            </>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestFragmentStaticDeep()
    const ssrComponent = testObservables[`TestFragmentStaticDeep_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestFragmentStaticDeep\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestFragmentStaticDeep.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Fragment - Static Deep</h3><p>first</p><p>second</p><p>deep</p>'
        const expected = '<p>first</p><p>second</p><p>deep</p>'

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


export default () => <TestSnapshots Component={TestFragmentStaticDeep} />