import { $, $$, useEffect, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestRef'
const TestRef = (): JSX.Element => {
    const ref = $<HTMLElement>()
    // Start with the expected value to avoid timing issues
    const content = $('Got ref - Has parent: true - Is connected: true')
    useEffect(() => {
        const element = ref()
        if (!element) return
        content(`Got ref - Has parent: ${!!element.parentElement} - Is connected: ${!!element.isConnected}`)
    }, { sync: true })

    const ret: JSX.Element = () => (
        <>
            <h3>Ref</h3>
            <p ref={ref}>{content}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ref`, ref)
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestRef.test = {
    static: false,
    expect: () => {
        // Define expected values for both main test and SSR test
        const element = $$(testObservables[`${name}_ref`]) as HTMLElement

        const expectedForSSR = [
            '<p>Got ref - Has parent: true - Is connected: true</p>',
            '<p>Got ref - Has parent: false - Is connected: false</p>',
        ]
        const expectedForDOM = [
            '<p>Got ref - Has parent: true - Is connected: true</p>',
            '<p>Got ref - Has parent: false - Is connected: false</p>',
        ]

        // Test the SSR value synchronously
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFullSSR = expectedForSSR.map(exp => '<h3>Ref</h3>' + exp)
        if (!expectedFullSSR.includes(ssrResult)) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected one of \n${expectedFullSSR.join('\n')}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }
        return expectedForDOM  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestRef} />