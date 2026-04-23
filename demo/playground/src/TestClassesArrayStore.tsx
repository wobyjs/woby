import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, assert, registerTestObservable, testObservables } from './util'

const name = 'TestClassesArrayStore'
const TestClassesArrayStore = (): JSX.Element => {
    const o = ['red', false]
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Array Store</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestClassesArrayStore()
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const expected = '<p class="red">content</p>'
    const expectedFull = `<h3>Classes - Array Store</h3>${expected}`
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestClassesArrayStore.test = {
    static: true,
    expect: () => {
        const expected = '<p class="red">content</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Classes - Array Store</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayStore} />