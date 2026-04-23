import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestComponentStaticProps'
const TestComponentStaticProps = ({ value }: { value: number }): JSX.Element => {
    registerTestObservable('TestComponentStaticProps', $(value))
    const ret: JSX.Element = () => (
        <>
            <h3>Component - Static Props</h3>
            <p>{value}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestComponentStaticProps({ value: random() })
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const propValue = $$(testObservables[name])
    const expectedFull = `<h3>Component - Static Props</h3><p>${propValue}</p>`
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestComponentStaticProps.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const propValue = $$(testObservables[name])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Component - Static Props</h3><p>${propValue}</p>`  // For SSR comparison
        const expected = `<p>${propValue}</p>`   // For main test comparison

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


export default () => <TestSnapshots Component={TestComponentStaticProps} props={{ value: random() }} />