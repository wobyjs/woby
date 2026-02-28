import { $, $$, useEffect, renderToString } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestChildOverReexecution = (): JSX.Element => {
    const count = $(0)
    let executions = 0
    registerTestObservable('TestChildOverReexecution', count)

    const increment = () => count(prev => Math.min(3, prev + 1))

    // Expose increment function for testing
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).testChildOverReexecutionIncrement = increment
        }
    })

    // For playground testing, add automatic increment
    useEffect(() => {
        const interval = setInterval(() => {
            if ($$(count) < 6) {
                increment()
            }
        }, 1000)

        return () => clearInterval(interval)
    })

    const ret: JSX.Element = (
        <>
            <h3>Child - OverReexecution</h3>
            <div>
                {() => executions += 1}
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
        const observable = testObservables['TestChildOverReexecution']
        let expected: string
        if (observable) {
            const currentValue = $$(observable)
            expected = `<div>1</div>${currentValue}`
        } else {
            expected = `<div>1</div>0`
        }

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestChildOverReexecution_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    // Extract the actual execution count from SSR result
                    const match = ssrResult.match(/<div>(\d+)<\/div>(\d+)/)
                    if (match) {
                        const ssrExecutions = parseInt(match[1])
                        const ssrCount = parseInt(match[2])
                        const expectedFull = `<h3>Child - OverReexecution</h3><div>${ssrExecutions}</div>${ssrCount}`
                        if (ssrResult === expectedFull) {
                            console.log(`✅ [TestChildOverReexecution] SSR test passed: ${ssrResult}`)
                        } else {
                            assert(false, `[TestChildOverReexecution] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                        }
                    } else {
                        assert(false, `SSR result format unexpected: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestChildOverReexecution] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestChildOverReexecution} />