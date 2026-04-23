import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestAttributeBooleanStatic'
const TestAttributeBooleanStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Attribute Boolan - Static</h3>
            <p disabled={true}>content</p>
            <p disabled={false}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestAttributeBooleanStatic() // Register the component
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const expectedFull = `<h3>Attribute Boolan - Static</h3><p disabled="">content</p><p>content</p>`
    const passed = ssrResult === expectedFull
    
    console.log(`\n📝 Test: ${name}`)
    console.log(`   SSR Output: ${ssrResult}`)
    console.log(`   Expected:   ${expectedFull}`)
    console.log(`   Pass:       ${passed ? '✅ YES' : '❌ NO'}\n`)
    
    if (!passed) {
        console.error(`❌ [${name}] SSR test failed`)
        process.exit(1)
    }
}

TestAttributeBooleanStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p disabled="">content</p><p>content</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Attribute Boolan - Static</h3><p disabled="">content</p><p>content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeBooleanStatic} />

// console.log(renderToString(< TestAttributeBooleanStatic />))