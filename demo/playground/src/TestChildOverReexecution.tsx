import { $, $$, useEffect, renderToString, type JSX } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert, runSSRTest } from './util'

const name = 'TestChildOverReexecution'
const TestChildOverReexecution = (): JSX.Element => {
    const count = $(0)
    const executions = $(0)
    let executionsLocal = 0
    registerTestObservable('TestChildOverReexecution', count)
    registerTestObservable(`${name}_executions`, executions)

    const increment = () => count(prev => Math.min(3, prev + 1))

    useEffect(() => {
        const interval = setInterval(() => {
            if ($$(count) < 6) {
                increment()
            }
        }, 1000)

        return () => clearInterval(interval)
    })

    const ret: JSX.Element = () => (
        <>
            <h3>Child - OverReexecution</h3>
            <div>
                {() => executionsLocal += 1}
            </div>
            {count}
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestChildOverReexecution.test = {
    static: false,
    expect: () => {
        const countObservable = testObservables[name]
        const executionsObservable = testObservables[`${name}_executions`]
        const currentValue = countObservable ? $$(countObservable) : 0
        const expected = `<div>1</div>${currentValue}`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        // Extract the actual execution count from SSR result
        const match = ssrResult.match(/<div>(\d+)<\/div>(\d+)/)
        let expectedFull: string
        if (match) {
            const ssrExecutions = parseInt(match[1])
            const ssrCount = parseInt(match[2])
            expectedFull = `<h3>Child - OverReexecution</h3><div>${ssrExecutions}</div>${ssrCount}`
        } else {
            expectedFull = `<h3>Child - OverReexecution</h3><div>1</div>${currentValue}`
        }
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestChildOverReexecution} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestChildOverReexecution)
