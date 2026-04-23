import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestRefUnmounting'
const TestRefUnmounting = (): JSX.Element => {
    const message = $('No ref') // Static value
    const ret: JSX.Element = () => (
        <>
            <h3>Ref - Unmounting</h3>
            <p>{message}</p>
            <p>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestRefUnmounting()
    const ssrComponent = testObservables[`TestRefUnmounting_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestRefUnmounting\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestRefUnmounting.test = {
    static: true,
    wrap: false,
    expect: () => {
        const expected = '<p>No ref</p><p>content</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Ref - Unmounting</h3><p>No ref</p><p>content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestRefUnmounting} />