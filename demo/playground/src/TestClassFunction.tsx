import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestClassFunction'
const TestClassFunction = (): JSX.Element => {
    const o = $(true)
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassFunction', o)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Class - Function Boolean</h3>
            <p class={{ red: () => o() }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestClassFunction()
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const value = $$(testObservables[name])
    const expectedFull = value ? '<h3>Class - Function Boolean</h3><p class="red">content</p>' : '<h3>Class - Function Boolean</h3><p>content</p>'
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestClassFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        const expected = value ? '<p class="red">content</p>' : '<p class="">content</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = value ? '<h3>Class - Function Boolean</h3><p class="red">content</p>' : '<h3>Class - Function Boolean</h3><p>content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassFunction} />