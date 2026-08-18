import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert, runSSRTest } from './util'

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

TestComponentStaticProps.test = {
    static: true,
    // The Node harness constructs the component itself, so it needs a real prop value —
    // otherwise `value` is undefined and the rendered <p> is empty.
    props: { value: random() },
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

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestComponentStaticProps)
