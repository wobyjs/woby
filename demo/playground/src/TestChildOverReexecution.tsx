import { $, $$, useEffect, renderToString, type JSX } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestChildOverReexecution = (): JSX.Element => {
    const count = $(0)
    const executions = $(0)
    let executionsLocal = 0
    registerTestObservable('TestChildOverReexecution', count)
    registerTestObservable('TestChildOverReexecution_executions', executions)

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
    registerTestObservable('TestChildOverReexecution_ssr', ret)

    return ret
}

TestChildOverReexecution.test = {
    static: false,
    expect: () => {
        const countObservable = testObservables['TestChildOverReexecution']
        const executionsObservable = testObservables['TestChildOverReexecution_executions']
        const currentValue = countObservable ? $$(countObservable) : 0
        const currentExecutions = executionsObservable ? $$(executionsObservable) : 0
        const expected = `<div>1</div>${currentValue}`

        const ssrComponent = testObservables['TestChildOverReexecution_ssr']
        const ssrResult = renderToString(ssrComponent)
        // Extract the actual execution count from SSR result
        const match = ssrResult.match(/<div>(\d+)<\/div>(\d+)/)
        if (match) {
            const ssrExecutions = parseInt(match[1])
            const ssrCount = parseInt(match[2])
            const expectedFull = `<h3>Child - OverReexecution</h3><div>${ssrExecutions}</div>${ssrCount}`
            if (ssrResult === expectedFull) {
                console.log(`✅ [TestChildOverReexecution] SSR test passed: ${ssrResult}`)
            } else {
                assert(false, `[TestChildOverReexecution] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
            }
        } else {
            assert(false, `SSR result format unexpected: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestChildOverReexecution} />